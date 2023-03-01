//These are Third party packages for smooth slideshow
import React, { useState } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Image from "next/image";
import Link from "next/link";
import Carousel from "react-simply-carousel";

const Slideshow = (props) => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="pl-5 pr-5 mt-2" style={{ borderLeft: "1px solid white" }}>
      <div>
        <Carousel
          containerProps={{
            className: "slideer",
            style: {
              width: "100%",
              justifyContent: "space-between",
              userSelect: "text",
            },
          }}
          activeSlideIndex={activeSlide}
          // activeSlideProps={{
          //   style: {
          //     background: "blue"
          //   }
          // }}
          onRequestChange={setActiveSlide}
          forwardBtnProps={{
            children: ">",
            style: {
              width: 40,
              height: 40,
              minWidth: 40,
              alignSelf: "center",
              background: "white",
              borderRadius: "50%",
              marginLeft: "10px",
            },
          }}
          backwardBtnProps={{
            children: "<",
            style: {
              width: 40,
              height: 40,
              minWidth: 40,
              alignSelf: "center",
              background: "white",
              borderRadius: "50%",
            },
          }}
          dotsNav={{
            show: false,
          }}
          itemsToShow={2}
          speed={400}
          maxWidth={480}
        >
          {props.banner?.slice(0, 6).map(function (banner, id) {
            return (
              <div className="flex justify-center" key={id}>
                <div
                  className="card w-[350px] h-[260px] rounded-[12px] border bg-base-100 mt-3 shadow-sm"
                  style={{ padding: "10px", margin: "10px" }}
                >
                  {banner.imageUrl ? (
                    <Image
                      alt=""
                      loading="eager"
                      width="251"
                      height="111"
                      src={banner.imageUrl}
                      className="rounded-[12px]"
                    />
                  ) : (
                    <Image
                      alt=""
                      loading="eager"
                      width="251"
                      height="111"
                      src="/images/noimage.jpg"
                      className="rounded-[12px]"
                    />
                  )}
                  <div className="card-body ml-0 p-1">
                    {banner.subtitle ? (
                      <p className="card-title text-[18px] font-[700] w-[60%] truncate">
                        {banner.subtitle}
                      </p>
                    ) : (
                      <p className="card-title text-[18px] font-[700] w-[50%] truncate"></p>
                    )}
                    {banner.title ? (
                      <p className="text-[14px] font-[400]">
                        {banner.title.slice(0, 80).concat("...")}
                      </p>
                    ) : (
                      <div className="p-3"></div>
                    )}
                    {banner.buttonUrl ? (
                      <div className="card-actions justify-end mt-4 text-[14px] font-[400] text-primary">
                        <Link href={banner.buttonUrl}>Read More</Link>
                      </div>
                    ) : (
                      <div className="card-actions justify-end mt-4 text-[14px] font-[400] text-[#EA3358]"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default Slideshow;
