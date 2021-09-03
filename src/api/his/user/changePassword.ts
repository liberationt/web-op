/*
 * @Date: 2020-04-20 20:48:53
 * @LastEditTime: 2020-04-20 20:50:35
 * @Description:
 * @FilePath: \web-op\src\api\his\user\changePassword.ts
 */
import axios from '@/utils/request.ts'

export const updataPassWord = (data: any) =>
    axios.request({
        url: "/system-service/sysuser/updataPassWord",
        method: "post",
        data
    });
