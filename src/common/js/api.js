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
// 查询是否可开锁
export function ischeckAll(params) {
  return request({
    url: "/boxLock/isRemoteOperateAllowed",
    method: "GET",
    params,
  });
}
// 开锁接口
export function unLock(query) {
  return request({
    url: "/boxLock/RemoteUnLock",
    method: "POST",
    data: query,
  });
}

// 盘点物品
export function check_goods(query) {
  return request({
    url: "/boxCheck/RemoteCheck",
    method: "POST",
    data: query,
  });
}

//查看盘点汇总
export function boxGetCheckAll(obj) {
  return request({
    url: "/boxCheck/getCheckAll",
    method: "get",
    params: obj,
  });
}

//异常格口列表
export function selectExceptionBoxList(obj) {
  return request({
    url: "/cabinetTerminal/selectExceptionBoxList",
    method: "get",
    params: obj,
  });
}

//格口忽略异常设置
export const updateIgnoreException = (obj) =>
  request({
    url: "/boxInfo/updateIgnoreException",
    method: "get",
    params: obj,
  });
