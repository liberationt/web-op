function getUserIP(func:any){
    if(typeof window != 'undefined'){
            var RTCPeerConnection:any = window.RTCPeerConnection ||  window.webkitRTCPeerConnection;
        // window.mozRTCPeerConnection ||
            if (RTCPeerConnection) (()=>{
        
                var rtc = new RTCPeerConnection()
        
                rtc.createDataChannel(''); //创建一个可以发送任意数据的数据通道
        
                rtc.createOffer(( offerDesc:any )=> { //创建并存储一个sdp数据
        
                rtc.setLocalDescription(offerDesc)
        
            }, (e:any) => { console.log(e)})
        
            rtc.onicecandidate =(evt:any) => { //监听candidate事件
        
                if (evt.candidate) {
        
                    console.log('evt:',evt.candidate)
        
                    let ip_rule:any = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        
                    var ip_addr:any = ip_rule.exec(evt.candidate.candidate)[1]
                    // this.test(ip_addr);//调用方法把ip地址的值传出去
                    func(ip_addr)
                }}
            })()
        }
}
export {
    getUserIP
}