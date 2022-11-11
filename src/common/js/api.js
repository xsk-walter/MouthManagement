import request from "../../utils/request";

// 获取token
export function getCabinetInvokeInfo() {
  return request({
    url: "/cabinet/getCabinetInvokeInfo.htm",
    method: "get",
  });
}
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
// 获取格口列表
export function grid_list(data) {
  return request({
    // 格口列表
    url: "/boxInfo/page",
    method: "post",
    data,
  });
}
// 获取设备id
// 获取设备列表
export function service_list(data) {
  return request({
    url: "/boxInfo/getDeviceName",
    method: "POST",
    data,
  });
}
// 格口详情
export function box_detail_info(obj) {
  return request({
    // 格口文件列表
    url: "/boxInfo/view",
    method: "get",
    params: obj,
  });
}
// 流程记录
export function box_log_list(data) {
  return request({
    // 格口文件列表
    url: "/boxLog/page",
    method: "post",
    data,
  });
}
export const isAdminUnlockingAllowed = (obj) =>
  request({
    //是否允许管理员开锁
    url: "/boxLock/isAdminUnlockingAllowed",
    method: "get",
    params: obj,
  });
export function boxAttrBan(data) {
  return request({
    //格口启用 停用
    url: "/boxInfo/updateBoxInfoEableState",
    method: "post",
    data,
  });
}
export const offBox = (obj) =>
  request({
    // 注销格口
    url: "/boxInfo/offBox",
    method: "post",
    params: obj,
  });
export const boxProductPageByState = (obj) =>
  request({
    //异常物品列表
    url: "/boxProduct/pageByState",
    method: "post",
    data: obj,
  });
// 盘点最近一次
export function findLastCheckRecode(params) {
  return request({
    url: "/boxCheck/findLastCheckRecode",
    method: "GET",
    params,
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

// 生成websocket链接的随机数
export function boxCheck_getGuid() {
  return request({
    url: "/boxCheck/getGuid",
    method: "GET",
  });
}
