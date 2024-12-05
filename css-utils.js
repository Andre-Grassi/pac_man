function getElementMarginsHeight(element) {
  const elementStyle = getComputedStyle(element)
  const marginTop = parseInt(elementStyle.marginTop)
  const marginBottom = parseInt(elementStyle.marginBottom)

  return marginTop + marginBottom
}

function getElementHeight(element) {
  const marginsHeight = getElementMarginsHeight(element)

  return element.offsetHeight + marginsHeight
}

export { getElementHeight, getElementMarginsHeight }
