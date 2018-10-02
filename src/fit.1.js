import { unesc } from './utils.js'

const element = document.createElement("canvas");
const context = element.getContext("2d");
const fit_font = "400 15px 'Roboto Condensed', sans-serif";
const tail_font = "700 15px 'Roboto Condensed', sans-serif";

function getTextSize(txt, font = fit_font) {
  context.font = font;
  return context.measureText(txt).width;
}

function processLineText(atomizedText, lineWidth, maxLines, fit_font) {
  let disposableAtomizedText = Array.from(atomizedText)
  let returnData = {text:[[]], lengths:[]}
  let thisLineWidth = 0;
  let nextWordWidth = 0
  let lineWidthTemp = (parseFloat(lineWidth) === Number(lineWidth)) ? widthTemplateText([], maxLines, lineWidth) : lineWidth

  while (disposableAtomizedText.length > 0){
    const thisLine = returnData.text[returnData.text.length-1]
    thisLineWidth = getTextSize(thisLine.join(" "), fit_font);
    const space = (thisLine.length === 0) ? "" : " "
    nextWordWidth = getTextSize(disposableAtomizedText[0] + space, fit_font);
    const lastLine = (returnData.text.length >= maxLines)
    const lineWillExceed = ((thisLineWidth + nextWordWidth) >= lineWidthTemp[returnData.text.length - 1])
    if(lineWillExceed && lastLine){
      returnData.lengths.push(thisLineWidth)
      return returnData;
    } else if (lineWillExceed){
      returnData.lengths.push(thisLineWidth)
      returnData.text.push([]);
    } else {
      const word = disposableAtomizedText.shift()
      thisLine.push(word); 
      thisLineWidth += nextWordWidth
    } 
  }
  returnData.lengths.push(thisLineWidth)
  return returnData
}


function atomizeText(text, sep = " ") {
  let startWords = text.split(sep);
  return startWords;
}

function padResults(text, maxLines){
  const arrayedText = (Array.isArray(text[0])) ? text : [text]
  let result = []
  for (let row = 0; row < maxLines; row++) {
    const offset = maxLines - arrayedText.length
    const val = (row - offset >= 0 && arrayedText[row - offset] !== undefined) ? arrayedText[row - offset] : []
    result.push(val)
  }
  return result
}

function plainTemplate(returnLines, maxLines, lineWidth) {
  let template = [];
  for (let row = 0; row < maxLines; row++) {
    const w = (returnLines[row] !== undefined) ? lineWidth - returnLines[row] : lineWidth
    template.push(w)
  }
  const roundedPositiveTemplate = template.map((val, i) => (template[i + 1] === undefined || template[i + 1] === lineWidth) ? val : 0)
  return roundedPositiveTemplate;
}

function widthTemplateText(returnLinesTail, maxLines, lineWidth) {
  let template = [];
  for (let row = 0; row < maxLines; row++) {
    const vals = returnLinesTail[returnLinesTail.length - maxLines + row];
    if (vals !== undefined) {
      template.push(lineWidth - vals);
    } else {
      template.push(lineWidth);
    }
  }
  return template;
}

const fit3 = (maxLines = 1, text, tailText, lineWidth) => {
  text = unesc(text)
  let sep = " "
  let atomizedText = atomizeText(text);
  const atomizedTailText = atomizeText(tailText);

  if (atomizedText.length === 1 && text.length > 25){
    sep = "/"
    atomizedText = atomizeText(text, sep = "/");
  }
  
  let returnLinesTailText = processLineText(Array.from(atomizedTailText).reverse(),lineWidth, maxLines, tail_font) 

  const tailTemplate = widthTemplateText(Array.from(returnLinesTailText.lengths).reverse(), maxLines, lineWidth)
  const returnLinesText = processLineText(atomizedText, tailTemplate, maxLines, fit_font) 

  if(returnLinesText.text.length >= 1 && returnLinesText.text[returnLinesText.text.length-1] == ""){
    returnLinesText.text.pop()
    returnLinesText.lengths.pop()
  }

  if (returnLinesText.text.flat().length === atomizedText.length) {
    atomizedTailText.shift()
    const positiveTemplate = plainTemplate(returnLinesText.lengths, maxLines, lineWidth);
    returnLinesTailText = processLineText(atomizedTailText, positiveTemplate, maxLines,tail_font) 
    returnLinesText.meta = {elipses:false}
  } else {
    returnLinesTailText.text = returnLinesTailText.text.map(line => line.reverse()).reverse()
    returnLinesTailText.text = padResults(returnLinesTailText.text, maxLines)
    returnLinesText.meta = {elipses:true}
  }

  returnLinesText.textNew = returnLinesText.text.map(line => line.join(sep))

  // console.log(returnLinesText.textNew.join(" "))
  console.log(returnLinesText, returnLinesTailText)
  console.log(returnLinesTailText.text.length)
  return {returnLinesText, returnLinesTailText, sep}

};

export default fit3;