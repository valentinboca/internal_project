export const themeReducer = (state: any, action: any) => {
    switch (action.type) {
      case "CHANGE_COLOR":
        return { ...state, color: action.payload };
      case "CHANGE_MODE":
        return { ...state, mode: action.payload };
      default:
        return state;
    }
  };