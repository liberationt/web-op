import axios from '@/utils/request.ts'

export const getAllNumber = (data: any) => {
  return axios({
    url: '/op-service/imtbkk/queryPatientImTbkkSum',
    method: 'post',
    data,
  })
}
