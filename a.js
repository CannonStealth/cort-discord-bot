function hasURL(url) {
    return url.match(
      /https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?/i
    );
  }

console.log(hasURL("Click this link to add as friend in Clash Royale!\n\nhttps://link.clashroyale.com/invite/friend/en?tag=9V2UPCVUY&token=hzh247h8&platform=iOS"))