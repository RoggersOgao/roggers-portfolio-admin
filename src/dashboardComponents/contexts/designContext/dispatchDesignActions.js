"use client";
export const fetchDsDesign = (item) => {
  return{
    type:"FEETCH_DESIGN",
    payload:item,
  }
}
export const AddDesign = (item) => {
  return {
    type: "ADD_DESIGN",
    payload: item,
  };
};
export const AddSingleDesign = (item) => {
  return {
    type: "ADD_SINGLE_DESIGN",
    payload: item,
  };
};
export const toogleDesignPhoto = () => {
  return {
    type: "IS_VISIBLE",
  };
};
export const setDesignIndex = (item) => {
  return {
    type:"SET_INDEX",
    payload: item,
  }
}
export const closeDesignPhoto = () => {
  return {
    type: "IS_NOT_VISIBLE",
  };
};

export const UpdateDesign = (item) => {
  return {
    type: "UPDATE_DESIGN",
    payload: item,
  };
};
export const RemoveDesign = (itemId) => {
  return {
    type: "REMOVE_DESIGN",
    payload: item,
  };
};
export const ClearDesign = () => {
  return {
    type: "CLEAR_DESIGN",
  };
};
