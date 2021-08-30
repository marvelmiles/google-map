export const getCity = (addrArr) => {
  for (let i = 0; i < addrArr.length; i++) {
    let type = addrArr[i]?.types[0];
    if (type && "administrative_area_level_2" === type)
      return addrArr[i].long_name;
  }
};
export const getArea = (addrArr) => {
  for (let i = 0; i < addrArr.length; i++) {
    let type = addrArr[i]?.types[0];
    if (type) {
      for (let j = 0; j < addrArr.length; j++) {
        let local = addrArr[i].types[j];
        if ("sublocality_level_1" === local || "locality" === local)
          return addrArr[i].long_name;
      }
    }
  }
};
export const getState = (addrArr) => {
  for (let i = 0; i < addrArr.length; i++) {
    let type = addrArr[i]?.types[0];
    for (let j = 0; j < addrArr.length; j++) {
      if (type && "administrative_area_level_1" === type)
        return addrArr[i].long_name;
    }
  }
};
