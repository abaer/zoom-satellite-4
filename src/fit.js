import {
  unesc
} from './utils.js'

const element = document.createElement('canvas');
const context = element.getContext("2d");
const fit_font = "14px 'Roboto Condensed', sans-serif"

function get_tex_size(txt, font) {
  context.font = font;
  return context.measureText(txt).width;
}

const fit2 = (maxLines = 1, text, tail_text, lineWidth) => {
  let char_mode = false
  text = unesc(text)

  text = text + " *" // hack
  const tail_length = get_tex_size(tail_text, "600 " + fit_font)
  let return_text = []
  let start_words = text.split(" ")
  let initial_length = start_words.length
  if (start_words.length === 2) {
    //Better fit by character if it's one long string like a URL
    start_words = text.split("")
    initial_length = start_words.length
    char_mode = true
  }

  let store_words = []
  let length_so_far = 0;
  let early_tail = false
  let elipses = ""
  while (start_words.length > 0 & return_text.length < maxLines) {
    let trial_text = (char_mode === false) ? start_words.join(" ") : start_words.join("")
    if (trial_text.slice(-1) === "*") {
      trial_text = trial_text.substr(0, trial_text.length - 1)
    }
    trial_text = trial_text.trim()
    elipses = (store_words.length > 1 && return_text.length === maxLines - 1 && trial_text.slice(-4, -1) !== " ...") ? " ... " : ""
    let tail = ""
    let width = 0;

    if (return_text.length === maxLines - 1) {
      tail = tail_text
      width = get_tex_size(trial_text + elipses + " ", "400 " + fit_font) + tail_length;
    } else if (return_text.length !== maxLines - 1 && length_so_far + start_words.length >= initial_length - 1) {
      width = get_tex_size(trial_text, "400 " + fit_font)
      if ((width + tail_length) <= lineWidth) {
        width = width + tail_length;
        tail = tail_text
        early_tail = true
      }
    } else {
      width = get_tex_size(trial_text, "400 " + fit_font)
    }

    if (width <= lineWidth) {
      length_so_far += start_words.length
      // elipses = (length_so_far < initial_length-1 && return_text.length == maxLines - 1 && trial_text.slice(-4, -1) != " ...") ? " ..." : elipses
      const tail_present = tail.length > 0 ? `<span class="tail";>${tail}</span>` : tail
      const fit_w_markup = trial_text + elipses + " "
      return_text.push(fit_w_markup)
      start_words = store_words
      store_words = []
      if (tail_present)
        early_tail = true
    }
    store_words.unshift(start_words.pop())
  }

  if (return_text.length < maxLines && tail_text !== "" && early_tail !== true) {
    // elipses = (length_so_far <  > 1 && trial_text.slice(-4, -1) != " ...") ? " ..." : elipses
    return_text.push("")
  }
  return {
    texts: return_text,
    tail: tail_text
  }
}

export {
  fit2
}