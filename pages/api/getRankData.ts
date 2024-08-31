import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

type ResponseData = {
  code: number
  message: string
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const ranks_name = await prisma.rank.groupBy({
    by: ['char_name'],
  })

  const ranks_time = await prisma.rank.findMany({
    where: {
      char_name: ranks_name[0].char_name,
    },
    select: {
      create_time: true,
    },
    orderBy: {
      create_time: 'asc'
    }
  })

  const ranks = await prisma.rank.findMany();

  const final_data = [];

  for( let i=0; i< ranks_name.length; i++) {
    let item = {} as any;
    item.name = ranks_name[i].char_name;
    item.vote_num = [];
    for (let j = 0; j< ranks.length; j++) {
      if (ranks[j].char_name === item.name) {
        item.vote_num.push(ranks[j].vote_num)
      }
    }
    item.vote_num.sort((a: number, b: number) => (a-b));
    final_data.push(item);
  }
  


  res.status(200).json({
    code: 0,
    message: 'success!',
    data: {
      // list: ranks,
      name: ranks_name,
      time: ranks_time,
      ranklist: final_data,
    },
  });

}