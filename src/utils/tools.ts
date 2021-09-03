
export const Msg = {
    loading(){
      let query:any = document.querySelector('.loading-page')
      console.log(query,'query')
      query.style.display = 'block';
    },
    hideLoading() {
      let query:any = document.querySelector('.loading-page')
      query.style.display = 'none';
    }
}

