import Image from 'next/image';

const Footer = () => {
  return (
    <div>
      <footer className="text-center lg:text-left">
        <div className="container p-custom">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 f-padding">
            <div className="mb-6">
              <h5 className="uppercase font-bold mb-2.5 text-gray-800 text-base">
                Services <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
              </h5>

              <ul className="list-none mb-0">
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Receipt
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Favorites
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Purchase Insights
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Account Info
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h5 className="uppercase font-bold mb-2.5 text-gray-800 text-base">
                COMPANY <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
              </h5>

              <ul className="list-none mb-0">
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Press kit
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h5 className="uppercase font-bold mb-2.5 text-gray-800 text-base">
                LEGAL <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
              </h5>

              <ul className="list-none mb-0">
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Terms of use
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-800 text-base">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#!" className="link link-hover text-base">
                    Cookie policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <footer className="footer sec-footer">
        <div className="items-center grid-flow-col">
          <Image
            alt=""
            loading="eager"
            height="40"
            width="100%"
            src="/images/newlogo.png"
          />
        </div>
        <div className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a>
              <Image
                alt=""
                height="50"
                width="30"
                loading="eager"
                src="/images/facebook-logo.svg"
              />
            </a>
            <a>
              <Image
                alt=""
                height="50"
                width="30"
                loading="eager"
                src="/images/twitter-logo.svg"
              />
            </a>
            <a>
              <Image
                alt=""
                height="50"
                width="30"
                loading="eager"
                src="/images/instagram-logo.svg"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Footer;
