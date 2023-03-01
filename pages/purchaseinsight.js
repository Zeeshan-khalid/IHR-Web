import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Image from 'next/image';

const Favorite = () => {
  return (
    <div className="card w-6/12">
      <div className="card-body bg-base-100  mtl">
        <h1 className="card-title justify-between">
          <div className="">
            <span className="text-2xl">Purchase Insights</span>
            <span
              className="tooltip tooltip-right align-super text-sm"
              data-tip="Purchase insight graph."
            >
              &#9432;
            </span>
            <em className="text-[#919191] text-xs capitalize font-semibold"> &nbsp; Future</em>
          </div>
        </h1>

        <div className="">
          <div className="flex justify-between">
            <div>
              <p className="text-[#8D9BA9] text-sm">JAN 01 - DEC 31</p>
              <span className="text-[#000] text-md font-bold">2021</span>
            </div>
            <div>
              <p className="text-[#000] text-4xl font-bold">$2,922.15</p>
            </div>
          </div>

          <Bar
            data={{
              labels: [
                "Amazon",
                "Walmart",
                "H-E-B",
                "Unknown",
                "Other",
                "H-E-b",
                "Unknown",
              ],
              datasets: [
                {
                  label: "Testing",
                  data: [
                    "608.46",
                    "470.53",
                    "353.02",
                    "233.83",
                    "1256.31",
                    "353.02",
                    "353.02",
                  ],
                  backgroundColor: [
                    "#C95988",
                    "#EF9A39",
                    "#FCF78A",
                    "#78A588",
                    "#63BFCE",
                    "#FCF78A",
                    "#C95988",
                  ],
                  borderColor: ["rgb(255, 99, 132, 0)"],
                  borderWidth: 1,
                  borderRadius: 8,
                },
              ],
            }}
            width={100}
            height={50}
            options={{
              maintainAspectRatio: true,
              // scales: {
              //   yAxes: [
              //     {
              //       gridLines: {
              //         display: false,
              //       },
              //     },
              //   ],
              // },
            }}
          />

          <div className="flex justify-between mt-4">
            <select className="select select-bordered w-11/12">
              <option disabled defaultValue>
                Yearly
              </option>
              <option>Yearly</option>
              <option>Monthly</option>
              <option>Daily</option>
            </select>
            <div className="relative top-3">
              <Image
                alt=""
                loading="eager"
                height="20"
                width="20"
                src="/images/filter.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Favorite;
