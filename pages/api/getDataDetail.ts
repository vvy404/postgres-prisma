// import cron from 'node-cron'

import { RankType, DefaultErrorType, OriginRankType, AjaxResType } from "@/lib/globals";

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface GetProductArgus {
  type?: string;
  bigType?: string;
  currentPageIndex?: number;
  pageNum?: number;
  keyword?: string;
}

interface ProductListResType {
  character_list: OriginRankType[];
  currentPageIndex: number;
  pageTotal: number;
  pageNum: number;
}


type ResponseData = {
  code: number
  message: string
  data: any
}

export const getProductListData = async ({
}: GetProductArgus): Promise<AjaxResType<ProductListResType, DefaultErrorType>> => {
  const res = await fetch(`https://vipact.api.mgtv.com/api/v1/act/vote/charlist?act_name=20240816pjzj4df&count=500&invoker=mobile-zhifubao&_dx_seq_id=ac37d509-3c75-2611-c2ab-f8287c0af2f3&mac=6020f230-7942-4422-bd4b-263811860ebb&v=v4`);
  const repo = await res.json()
  console.log('res', repo);
  return repo;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // const products = await prisma.$queryRaw`SELECT * FROM Product`
  // const type = Number(req.query.type);
  // const bigType = Number(req.query.bigType);
  // const pageNum = Number(req.query.pageNum);
  // const pageIndex = Number(req.query.currentPageIndex);
  // const keyword = String(req.query.keyword);
  // const {userid} = req.cookies;
  // let products = [];
  
  //   const products = await prisma.rank.findMany();
  const data_res = await getProductListData({});
  let result = [];

  if(Number(data_res.errno) === 0) {
    const data = data_res.data;
    const list = data?.character_list;
    if (list && list.length) {
      for (let i =0 ;i<list?.length; i++) {
        let item = list[i];
        let res: RankType = {} as any;
        const { char_id, char_name, vote_num} = item;
        res.char_id = char_id;
        res.char_name = char_name;
        res.vote_num = vote_num;
        
        result.push(res);
      }
    }
    result = result.filter(i => [3207, 3203, 3195, 3208, 3206, 3196, 3180, 3183].includes(i.char_id));

    console.log('res-------', result);


    for (const post of result) {
      await prisma.rank.create({
        data: post,
      });
    }
  

  }

  res.status(200).json({
    code: 0,
    message: 'success!',
    data: {
      list: [],
      // mainlist: products,
      // newlist: products,
    },
  });

}