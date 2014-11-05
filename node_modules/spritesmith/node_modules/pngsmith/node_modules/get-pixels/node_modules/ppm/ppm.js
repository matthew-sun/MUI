"use strict";
var through = require("through");

//Create parser state
var PARSER_STATE = {
  HEADER: 0,
  BODY: 1,
  DONE: 2,
  ERROR: 3
};

var TOKEN_TYPE = {
  HEADER:   0,
  NUMBER:   1
};

function makeToken(token, match) {
  if(match.type === "header") {
    return {
      type: TOKEN_TYPE.HEADER,
      width: parseInt(match.regex[0]),
      height: parseInt(match.regex[1]),
      depth: parseInt(match.regex[2])
    };
  } else if(match.type === "rgb") {
    return {
      type: TOKEN_TYPE.RGB,
      rgb: [ parseInt(match.regex[0]), parseInt(match.regex[1]), parseInt(match.regex[2]) ]
    };
  }
}

function PPMParser(stream, cb) {
  this.cb = cb;
  this.buffer = [];
  this.width = 0;
  this.height = 0;
  this.depth = 0;
  this.state  = PARSER_STATE.HEADER;
  this.cur_row = 0;
  this.cur_col = 0;
  this.cur_channel = -1;
  this.image = [];
  
  this.buffer = [];
  this.ptr = 0;

  this.stream = stream;
  this.error_cb = PPMParser.prototype.onerror.bind(this);
  this.data_cb = PPMParser.prototype.ondata.bind(this);
  this.end_cb = PPMParser.prototype.onend.bind(this);
  stream.on("error", this.error_cb);
  stream.on("data", this.data_cb);
  stream.on("end", this.end_cb);
}

PPMParser.prototype.next = function(index) {
  if(++index[0] >= this.buffer[index[1]].length) {
    index[0] = 0;
    if(++index[1] >= this.buffer.length) {
      index[0] = -1;
      index[1] = this.buffer.length;
    }
  }
}

PPMParser.prototype.get = function(index) {
  if(index[0] < 0) {
    return -1;
  }
  return this.buffer[index[1]][index[0]];
}

PPMParser.prototype.ondata = function(data) {
  if(this.state === PARSER_STATE.ERROR || data.length === 0) {
    return;
  }
  this.buffer.push(new Buffer(data));
  var ptr = [this.ptr, 0];
  var cur = [0,0];
tok_loop:
  while(ptr[0] >= 0 &&
    this.state !== PARSER_STATE.ERROR &&
    this.state !== PARSER_STATE.DONE) {
    cur[0] = ptr[0];
    cur[1] = ptr[1];
    switch(this.get(ptr)) {
      //Comment
      case 35:
        while(true) {
          var c = this.get(cur);
          if(c < 0) {
            break tok_loop;
          }
          if(c === 0x0d || c === 0x0a) {
            break;
          }
          this.next(cur);
        }
        ptr[0] = cur[0];
        ptr[1] = cur[1];
      break;
      
      //Whitespace
      case 0x09:
      case 0x0a:
      case 0x0b:
      case 0x0c:
      case 0x0d:
      case 0x20:
        this.next(ptr);
      break;
      
      //Header
      case 80:
        if(this.get(cur) < 0) {
          break tok_loop;
        }
        this.next(cur);
        if(this.get(cur) !== 51) {
          return;
        }
        this.ontoken(TOKEN_TYPE.HEADER);
        this.next(cur);
        ptr[0] = cur[0];
        ptr[1] = cur[1];
      break;
      
      //Number
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 58:
      case 59:
        var value = 0;
        while(true) {
          var x = this.get(cur);
          if(x < 0) {
            break tok_loop;
          } else if(x < 48 || x > 59) {
            break;
          }
          this.next(cur);
          value = value * 10 + x - 48;
        }
        this.ontoken(TOKEN_TYPE.NUMBER, value);
        ptr[0] = cur[0];
        ptr[1] = cur[1];
      break;
      
      case -1:
        break tok_loop;
      break;
      
      default:
        this.onerror(new Error("Invalid character in token stream: " + this.get(ptr)));
        return;
    }
  }
  //Advance pointer
  if(ptr[0] < 0) {
    this.ptr = 0;
    this.buffer.length = 0;
  } else {
    this.ptr = ptr[0];
    if(ptr[1] > 0) {
      this.buffer.splice(0, ptr[1]);
    }
  }
};

PPMParser.prototype.onerror = function(err) {
  if(this.state === PARSER_STATE.ERROR || this.state === PARSER_STATE.DONE) {
    return;
  }
  this.buffer = [];
  this.image = [];
  this.stream.removeListener("data", this.data_cb);
  this.stream.removeListener("error", this.error_cb);
  this.stream.removeListener("end", this.end_cb);
  this.state = PARSER_STATE.ERROR;
  this.cb(err, null);
  this.data_cb = this.error_cb = this.end_cb = null;
}

PPMParser.prototype.ontoken = function(type, value) {
  switch(this.state) {
    case PARSER_STATE.HEADER:
      if(this.cur_channel < 0 && type === TOKEN_TYPE.HEADER) {
        //Keep reading header, set channel to 1
        this.cur_channel = 0;
      } else if(this.cur_channel >= 0 && type === TOKEN_TYPE.NUMBER) {
        switch(this.cur_channel) {
          case 0:
            this.width = value;
          break;
          case 1:
            this.height = value;
          break;
          case 2:
            this.depth = value;
            this.image = new Array(this.height);
            for(var i=0; i<this.height; ++i) {
              var row = new Array(this.width);
              for(var j=0; j<this.width; ++j) {
                row[j] = [0,0,0];
              }
              this.image[i] = row;
            }
            this.state = PARSER_STATE.BODY;
            this.cur_col = this.cur_row = this.cur_channel = 0;
            return;
          break;
          default:
            this.onerror(new Error("Invalid PPM header"));
          break;
        }
        this.cur_channel++;
      } else {
        this.onerror(new Error("Invalid PPM file"));
        return;
      }
      
    break;
    
    case PARSER_STATE.BODY:
      if(type !== TOKEN_TYPE.NUMBER) {
        this.onerror(new Error("Invalid token in PPM file"));
        return;
      }
      this.image[this.cur_row][this.cur_col][this.cur_channel] = value;
      if(++this.cur_channel >= 3) {
        this.cur_channel = 0;
        if(++this.cur_col >= this.width) {
          this.cur_col = 0;
          if(++this.cur_row >= this.height) {
            this.state = PARSER_STATE.DONE;
          }
        }
      }
    break;
    
    case PARSER_STATE.DONE:
    case PARSER_STATE.ERROR:
    break;
    
    default:
    break;
  }
};

PPMParser.prototype.onend = function() {
  this.ondata(new Buffer("\n"));
  
  switch(this.state) {
    case PARSER_STATE.ERROR:
    break;
    
    case PARSER_STATE.DONE:
      this.buffer.length = 0;;
      this.cb(null, this.image);
    break;
    
    default:
      this.state = PARSER_STATE.ERROR;
      this.cb(new Error("Unexpected EOF"), null);
    break;
  }
}

//Parses a ppm image
exports.parse = function(stream, cb) {
  return new PPMParser(stream, cb);
}

//Writes a PPM image to file
function PPMWriter(image) {
  this.stream = through();
  this.image = image;
  this.cur_row = 0;
  this.cur_col = 0;
  this.drain_cb = PPMWriter.prototype.writeBody.bind(this);
  
  this.stream.on("drain", this.drain_cb);
  process.nextTick(PPMWriter.prototype.writeHeader.bind(this));
}

PPMWriter.prototype.writeHeader = function() {
  if(this.stream.write("P3\n#JS PPM\n" + this.image[0].length + " " + this.image.length + "\n255\n")) {
    this.writeBody();
  }
}

PPMWriter.prototype.writeBody = function() {
  while(this.stream.write(this.image[this.cur_row][this.cur_col].join(" ")+" ")) {
    if(++this.cur_col >= this.image[0].length) {
      this.cur_col = 0;
      if(++this.cur_row >= this.image.length) {
        this.stream.removeListener("drain", this.drain_cb);
        this.stream.end("\n");
        break;
      }
    }
  }
}

//Serializes an image to a ppm
exports.serialize = function(image) {
  var writer = new PPMWriter(image);
  return writer.stream;
}
