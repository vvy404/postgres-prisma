import { RankType, DefaultErrorType, ProductColorType, RankResType, AjaxResType } from "@/lib/globals";

interface GetProductArgus {
  currentPageIndex?: number;
  pageNum?: number;
}

interface ProductListResType {
  // list: RankType[];
  name: {char_name: string}[];
  time: {create_time: Date}[];
  ranklist: RankResType[];
  currentPageIndex?: number;
  pageTotal?: number;
  pageNum?: number;

}


export const getData = async (): Promise<AjaxResType<ProductListResType, DefaultErrorType>> => {
  const res = await fetch(`/api/getRankData`);
  const repo = await res.json();

  return repo;
}