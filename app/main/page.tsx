"use client"

import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';
import { getData } from '@/apis/getData';

export default function Main() {
  let optionDefault = {
    title: {
      text: 'Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      // data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      data: [] as any
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [] as any
    },
    yAxis: {
      type: 'value'
    },
    series: [
      // {
      //   name: 'Email',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [120, 132, 101, 134, 90, 230, 210]
      // },
      // {
      //   name: 'Union Ads',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [220, 182, 191, 234, 290, 330, 310]
      // },
      // {
      //   name: 'Video Ads',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [150, 232, 201, 154, 190, 330, 410]
      // },
      // {
      //   name: 'Direct',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [320, 332, 301, 334, 390, 330, 320]
      // },
      // {
      //   name: 'Search Engine',
      //   type: 'line',
      //   stack: 'Total',
      //   data: [820, 932, 901, 934, 1290, 1330, 1320]
      // }
    ] as any
  };

  const [option, setOption] = useState(optionDefault)

  const formatTime = (date: Date) => {
    let d = new Date(date);

    let str = '';
    str = [d.getMonth()+1,
      d.getDate()].join('/')+' '+
     [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return str;
  }

  const getPageData = async () => {
    const res = await getData();
    if(res && !res.code && res.data) {
      console.log('getPageData', res.data);
      const { name, time, ranklist} = res.data;
      const option_copy = {
        ...option,
        legend: {
          ...option.legend,
          data: [] as any
        },
        xAxis: {
          ...option.xAxis,
          data: [] as any
        },
        series: [] as any
      }
      // option.legend.data = [];
      name.forEach((i: { char_name: any; }) => {
        option_copy.legend.data.push(i.char_name);
      });
      // option.xAxis.data = [];
      time.forEach((i: { create_time: Date; })=> {
        option_copy.xAxis.data.push(formatTime(i.create_time));
      })
      option.series = [];
      ranklist.forEach((rank: { name: any; vote_num: any; }) => {
        let series_item = {
          name: rank.name,
          type: 'line',
          // stack: 'Total',
          data: rank.vote_num,
        }
        option_copy.series.push(series_item);
      })
      setOption(option_copy);
      console.log(option_copy)
    }
  }

  useEffect(() => {
    getPageData();
  },[] )
  
  return (
    <div className='bg-white'>
      <ReactECharts option={option} style={{height: '700px'}}/>
    </div>
  );
}