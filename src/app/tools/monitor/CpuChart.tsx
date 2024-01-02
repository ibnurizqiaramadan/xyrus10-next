'use-client';

import { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

/**
 * Renders a CPU chart component.
 *
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID of the chart canvas element.
 * @param {number[]} props.cores - An array of CPU core data.
 * @param {number} props.threads - The number of CPU threads.
 * @param {string} props.name - The name of the CPU chart.
 * @return {JSX.Element} - The rendered CPU chart component.
 */


export const CpuChart = (props: {
  id: string,
  cores: number[],
  threads: number,
  name: string,
  dataLenght?: number
}): JSX.Element => {
  const myChartRef = useRef<Chart | null>(null);
  const dataLenght = props.dataLenght ?? 60;

  useEffect(() => {
    Chart.register(...registerables);
    const ctx = document.getElementById(props.id) as HTMLCanvasElement;
    // const labels = Array.from({ length: dataLenght }, (_, index) => new Date(Date.now() - ((dataLenght - index) * 1000)).toLocaleTimeString());
    const labels = Array.from({ length: dataLenght }, (_, index) => index + 1);

    myChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        yLabels: [ '10', 20, 30, 40, 50, 60, 70, 80, 90, 100 ],
        datasets: [],
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        color: '#fff',
        backgroundColor: '#fff',
        layout: {
          autoPadding: true,
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14,
              },
            },
          },
          title: {
            display: true,
            text: '',
          },
        },
        scales: {
          x: {
            // max: 60,
            ticks: {
              color: 'white',
            },
            grid: {
              display: false,
            },
          },
          y: {
            min: 0,
            max: 100,
            ticks: {
              color: 'white',
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });

    for (let index = 0; index < props.threads; index++) {
      const randomColor = () => Math.floor(Math.random() * 255) + 1;
      const r = randomColor();
      const g = randomColor();
      const b = randomColor();
      const color1 = `rgba(${r}, ${g}, ${b}, 255)`;
      const color2 = `rgba(${r}, ${g}, ${b}, 0.1)`;

      myChartRef.current?.data.datasets.push({
        label: `CPU ${index}`,
        data: JSON.parse(localStorage.getItem(`${props.name}-cpu-${index}`) ?? '[]') as any[],
        backgroundColor: color2,
        borderColor: color1,
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 1,
        tension: 0.4,
        fill: true,
      });
    }

    myChartRef.current?.update();

    return () => {
      myChartRef.current?.destroy();
    };
  }, [ props.threads, props.id, props.name, dataLenght ]);

  useEffect(() => {
    const chartLabels = myChartRef.current?.data.labels as any[];
    chartLabels.map((label, index) => {
      if (chartLabels.length > dataLenght) {
        chartLabels.pop();
      }
      chartLabels.unshift(new Date(Date.now() - (index * 1000)).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
    });
    props.cores.forEach((core, index) => {
      const chartData = myChartRef.current?.data.datasets[index].data as any[];
      chartData.push(core);
      if (chartData.length > dataLenght) {
        chartData.shift();
      }
      localStorage.setItem(`${props.name}-cpu-${index}`, JSON.stringify(chartData));
    });

    myChartRef.current?.update();
  }, [ props.cores, props.name, dataLenght ]);

  return (
    <div className='h-full w-full'>
      <canvas id={props.id}></canvas>
    </div>
  );
};

