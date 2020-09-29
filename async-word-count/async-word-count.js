var fs = require('fs');
var path = require('path');

var getWordCount = function(filePath, callback) {
  fs.readFile(filePath, 'utf-8', function(err, data) {
    if (err) {
      callback(err, null);
      return;
    }

    var wordCount = data.trim().split(' ').length;
    callback(null, wordCount);
  });
};

var getTotalWordCount = async(filePathOne, filePathTwo, callback) => {
  await getWordCount(filePathOne, callback);
  await getWordCount(filePathTwo, callback);
};

module.exports = getTotalWordCount;
