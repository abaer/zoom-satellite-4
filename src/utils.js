function getDateString() {
  let d = new Date(Date.now())
  let date = d.getDate()
  let month = d.getMonth() + 1
  let year = d.getFullYear()
  return `${date}-${month}-${year}`
}

const getImage = (label_info) => {
  const image_hierarchy = ["media_url", "image_ref", "profile_image_url"]
  for (let loc of image_hierarchy) {
    if (label_info[loc] !== undefined && label_info[loc] !== "") {
      return { src: label_info[loc], img_type: loc }
    }
  }
  return { src: undefined, img_type: undefined }
}


const updateUrlBox = (newList) => {
  var url = window.location.href;
  var urlParts = url.split('?');
  if (urlParts.length > 0) {
    var baseUrl = urlParts[0];
    var updatedUri = baseUrl + '?list=' + newList;
    window.history.pushState({
      path: updatedUri
    }, document.title, updatedUri);
    // window.history.replaceState({}, document.title, updatedUri);
  }
}

function patchProfileURL(src) {
  var lastIndex = src.lastIndexOf("_");
  var tail = src.substring(src.lastIndexOf("."), )
  src = src.substring(0, lastIndex) + tail;
  src = src.replace(/http:/, "https:")
  return src
}

function unesc(str) {
  let decoded = str.replace(/&amp;/g, '&');
  decoded = decoded.replace(/&gt;/g, '>');
  decoded = decoded.replace(/&lt;/g, '<');
  decoded = decoded.replace(/&quot;/g, '"');
  decoded = decoded.replace(/&#39;/g, "'");
  return decoded
}

function bounds(obj, key){
  const arr = obj.map(item => item[key])
  return [Math.min(...arr), Math.max(...arr)]
}

export { getDateString, getImage, patchProfileURL, unesc, bounds, updateUrlBox }