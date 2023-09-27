export const addFile = (item) => {
  return{
    type:"DROPDOWN_PREVIEW_DATA",
    payload:item,
  }
}

export const isVisible = () => {
  return {
    type:"IS_VISIBLE"
  }
}
export const isHidden = () => {
  return {
    type:"IS_NOT_VISIBLE"
  }
}

