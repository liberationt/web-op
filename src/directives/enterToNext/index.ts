/*
 * @Author: wangyao
 * @LastEditTime: 2020-09-16 15:35:24
 * @LastEditors: wangyao
 * @Description:回车自动下一项
 * @FilePath: \web-op\src\directives\enterToNext\index.ts
 */
export const enterToNext: any = {
    inserted(el: any, binding: any) {
        let inputs = el.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].setAttribute("keyFocusIndex", i);
            inputs[i].addEventListener('keyup', (ev:any) => {
                if (ev.keyCode === 13) {
                    let targetTo = ev.srcElement.getAttribute('keyFocusTo');
                    if (targetTo) {
                        const refs: any = this.$refs[targetTo]
                        refs.$el.focus();
                    } else {
                        var attrIndex = ev.srcElement.getAttribute('keyFocusIndex');
                        var ctlI = parseInt(attrIndex);
                        if (ctlI < inputs.length - 1) inputs[ctlI + 1].focus();
                    }
                }
            });
        }
    }
}
