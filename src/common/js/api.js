import request from "../../utils/request";

export function boxGoodsList(obj) {
  return request({
    // 格口文件列表
    url: "/boxInfo/queryInProductByBoxId",
    method: "get",
    params: obj,
  });
}

// 一、格口管理 接口
// 终端名称
export function mouthSelect(obj) {
  return request({
    url: "/cabinetTerminal/select",
    method: "post",
    params: obj,
  });
}
