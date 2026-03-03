import svgPaths from "./imports/svg-paths";
import imgPaper21 from "./assets/9600d715b43f7d60b6c4a7bbdc9c2c66b3288cdd.png";
import imgImage5 from "./assets/10e09fc392a8b074791b0ec683f23a90ba0a73b6.png";
import imgImage7 from "./assets/45238b0bccc8e5bfd9ca5116b13594d7c28bf341.png";
import imgImage9 from "./assets/80e090bbb4cf707b84d8191d389f1f6fec8e8528.png";

export default function App() {
  return (
    /* ===== Full-screen centering wrapper ===== */
    <div className="size-full flex items-center justify-center bg-gray-100">

      {/* ===== iPhone 17 frame — fixed size with overflow hidden to clip elements that extend beyond ===== */}
      <div
        className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        style={{ width: 402, height: 874, overflow: "hidden" }}
      >

        {/* ===== Paper texture background — large tiled image behind everything ===== */}
        <div
          className="absolute bg-size-[834px_1078.5px] bg-top-left h-[2157px] left-[-599px] top-[-1059px] w-[1668px]"
          style={{ backgroundImage: `url('${imgPaper21}')` }}
        />

        {/* ===== Large blue star (top-left decorative) ===== */}
        <div className="absolute flex h-[427px] items-center justify-center left-[-91.04px] top-[-107px] w-[417.041px]">
          <div className="flex-none rotate-15">
            <div className="h-[351.62px] relative w-[337.536px]">
              <div className="absolute inset-[0_1.26%_7.27%_1.26%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 329.016 326.044">
                  <g filter="url(#filter_star1)">
                    <path d={svgPaths.pfb34f00} fill="#D1EEFE" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="326.044" id="filter_star1" width="329.016" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Rotated map image (top-right, behind content, rotated -60deg) ===== */}
        <div className="absolute flex h-[727.025px] items-center justify-center left-[186px] top-[-557px] w-[588.876px]">
          <div className="-rotate-60 flex-none">
            <div className="h-[292.937px] opacity-40 relative w-[670.369px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage5} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Title letter blocks — "SightLinE" with each letter in a different font on tan cards ===== */}
        {/* Tan card backgrounds */}
        <div className="absolute flex h-[99px] items-center justify-center left-[13px] top-[62px] w-[95.463px]">
          <div className="-rotate-10 flex-none">
            <div className="bg-[#eee1d0] h-[86.112px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[81.752px]" />
          </div>
        </div>
        <div className="absolute bg-[#eee1d0] h-[90px] left-[72px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[73px] w-[80px]" />
        <div className="absolute bg-[#eee1d0] h-[90px] left-[133px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[50px] w-[80px]" />
        <div className="absolute flex h-[90.94px] items-center justify-center left-[175px] top-[73px] w-[82.828px]">
          <div className="flex-none rotate-10">
            <div className="bg-[#eee1d0] h-[80px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[70px]" />
          </div>
        </div>
        <div className="absolute bg-[#eee1d0] left-[219px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-[80px] top-[62px]" />
        <div className="absolute flex h-[86.473px] items-center justify-center left-[263px] top-[82px] w-[80.049px]">
          <div className="-rotate-10 flex-none">
            <div className="h-[75.832px] relative w-[67.913px]">
              <div className="absolute inset-[0_-5.89%_-10.55%_-5.89%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75.9128 83.8324">
                  <g filter="url(#filter_rect12)">
                    <path d="M4 0H71.9128V75.8324H4V0Z" fill="#EEE1D0" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="83.8324" id="filter_rect12" width="75.9128" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[93.894px] items-center justify-center left-[295px] top-[60.2px] w-[93.997px]">
          <div className="flex-none rotate-10">
            <div className="bg-[#eee1d0] h-[81.032px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[81.159px]" />
          </div>
        </div>

        {/* Title letters — each in a unique decorative font */}
        <p className="absolute font-['Irish_Grover:Regular',sans-serif] h-[59px] leading-[normal] left-[42px] not-italic text-[#452d2d] text-[60px] top-[75px] w-[55px]">S</p>
        <p className="absolute font-['Inika:Regular',sans-serif] h-[53px] leading-[normal] left-[84px] not-italic text-[#452d2d] text-[60px] top-[89px] w-[33px]">I</p>
        <p className="absolute font-['Jacques_Francois_Shadow:Regular',sans-serif] h-[59px] leading-[normal] left-[112px] not-italic text-[#452d2d] text-[60px] top-[63px] w-[55px]">g</p>
        <p className="absolute font-['JejuHallasan:Regular',sans-serif] h-[59px] leading-[normal] left-[150px] not-italic text-[#452d2d] text-[60px] top-[74px] w-[55px]">h</p>
        <p className="absolute font-['Gugi:Regular',sans-serif] h-[59px] leading-[normal] left-[190px] not-italic text-[#452d2d] text-[60px] top-[89px] w-[55px]">t</p>
        <p className="absolute font-['Jacques_Francois_Shadow:Regular',sans-serif] h-[59px] leading-[normal] left-[215px] not-italic text-[#452d2d] text-[60px] top-[64px] w-[55px]">L</p>
        <p className="absolute font-['Jaini_Purva:Regular',sans-serif] h-[59px] leading-[normal] left-[263px] not-italic text-[#452d2d] text-[60px] top-[76px] w-[55px]">i</p>
        <p className="absolute font-['Griffy:Regular',sans-serif] h-[59px] leading-[normal] left-[280px] not-italic text-[#452d2d] text-[60px] top-[81px] w-[55px]">N</p>
        <p className="absolute font-['Germania_One:Regular',sans-serif] h-[59px] leading-[normal] left-[330px] not-italic text-[#452d2d] text-[60px] top-[72px] w-[55px]">E</p>

        {/* ===== Pink star (top-right decorative, rotated -20deg) ===== */}
        <div className="absolute flex h-[128.041px] items-center justify-center left-[287px] top-[168px] w-[127.934px]">
          <div className="-rotate-20 flex-none">
            <div className="h-[99.947px] relative w-[99.767px]">
              <div className="absolute inset-[0_-1.56%_1.54%_-1.56%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102.884 98.4025">
                  <g filter="url(#filter_star2)">
                    <path d={svgPaths.p1aa95f80} fill="#FEEAF3" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="98.4025" id="filter_star2" width="102.884" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Paperclip image (left side, rotated -90deg) ===== */}
        <div className="absolute flex h-[91px] items-center justify-center left-[52px] top-[199px] w-[36px]">
          <div className="-rotate-90 flex-none">
            <div className="h-[36px] relative w-[91px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
            </div>
          </div>
        </div>

        {/* ===== Login form card — white rounded rectangle with shadow ===== */}
        <div className="absolute bg-white h-[270px] left-[37px] rounded-[10px] shadow-[0px_6px_4px_0px_rgba(0,0,0,0.25)] top-[227px] w-[327px]" />

        {/* ===== Email input field (rounded pill with inner shadow) ===== */}
        <div className="absolute h-[53px] left-[49px] top-[270px] w-[304px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 304 53">
            <g filter="url(#filter_email)">
              <path d={svgPaths.p14459f0} fill="#FFFCE9" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57" id="filter_email" width="304" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="6" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
              </filter>
            </defs>
          </svg>
        </div>
        <p className="absolute font-['Hi_Melody:Regular',sans-serif] h-[50px] leading-[normal] left-[70px] not-italic text-[#452d2d] text-[30px] top-[283px] w-[188px]">Email:</p>

        {/* ===== Password input field (rounded pill with inner shadow) ===== */}
        <div className="absolute h-[53px] left-[49px] top-[353px] w-[304px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 304 53">
            <g filter="url(#filter_password)">
              <path d={svgPaths.p14459f0} fill="#FFFCE9" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57" id="filter_password" width="304" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="6" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
              </filter>
            </defs>
          </svg>
        </div>
        <p className="absolute font-['Hi_Melody:Regular',sans-serif] h-[50px] leading-[normal] left-[70px] not-italic text-[#452d2d] text-[30px] top-[366px] w-[188px]">Password:</p>

        {/* ===== Log In button (gradient pill with drop shadow) ===== */}
        <div className="absolute h-[43px] left-[127px] top-[430px] w-[148px]">
          <div className="absolute inset-[0_-2.7%_-23.26%_-2.7%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156 53">
              <g filter="url(#filter_login)">
                <path d={svgPaths.p1e8d0a80} fill="#FFFCE9" />
                <path d={svgPaths.p1e8d0a80} fill="url(#paint_login)" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53" id="filter_login" width="156" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="6" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint_login" x1="4" x2="152" y1="21.5" y2="21.5">
                  <stop stopColor="#FEEAF3" />
                  <stop offset="1" stopColor="#D1EEFE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <p className="absolute font-['Hi_Melody:Regular',sans-serif] h-[50px] leading-[normal] left-[calc(50%-36px)] not-italic text-[#452d2d] text-[30px] top-[436px] w-[71px]">Log In</p>

        {/* ===== Map image (bottom area, rotated -8deg, semi-transparent) ===== */}
        <div className="absolute flex h-[698.873px] items-center justify-center left-[-301.13px] top-[439.61px] w-[1284.426px]">
          <div className="-rotate-8 flex-none">
            <div className="h-[534px] opacity-40 relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[1222px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage5} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== "new account" link with underline in a white pill ===== */}
        <div className="absolute bg-white h-[44px] left-[76px] rounded-[10px] shadow-[0px_6px_4px_0px_rgba(0,0,0,0.25)] top-[560px] w-[250px]" />
        <p className="absolute decoration-solid font-['Hi_Melody:Regular',sans-serif] h-[50px] leading-[normal] left-[138px] not-italic text-[#452d2d] text-[30px] top-[566px] underline w-[188px]">new account</p>

        {/* ===== Small blue star (bottom-left decorative) ===== */}
        <div className="absolute flex h-[112.099px] items-center justify-center left-[31px] top-[566px] w-[110.135px]">
          <div className="flex-none rotate-15">
            <div className="h-[92.116px] relative w-[89.338px]">
              <div className="absolute inset-[0_-2.03%_0.86%_-2.03%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 92.9653 91.3196">
                  <g filter="url(#filter_star3)">
                    <path d={svgPaths.p2e544d00} fill="#D1EEFE" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="91.3196" id="filter_star3" width="92.9653" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Paperclip image (right side, rotated 100deg) ===== */}
        <div className="absolute flex h-[71.725px] items-center justify-center left-[286.2px] top-[522.45px] w-[38.613px]">
          <div className="flex-none rotate-100">
            <div className="h-[27.213px] relative w-[68.033px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
            </div>
          </div>
        </div>

        {/* ===== Push pin image (top-right corner) ===== */}
        <div className="absolute left-[314px] size-[109px] top-[-20px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage9} />
        </div>

        {/* ===== Push pin image (bottom-left, flipped) ===== */}
        <div className="absolute flex items-center justify-center left-[-9px] size-[109px] top-[681px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="relative size-[109px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage9} />
            </div>
          </div>
        </div>

        {/* ===== Decorative pink rectangle (bottom-left, rotated 10deg) ===== */}
        <div className="absolute flex h-[175.039px] items-center justify-center left-[-2px] top-[760px] w-[202.618px]">
          <div className="flex-none rotate-10">
            <div className="h-[146px] relative w-[180px]">
              <div className="absolute inset-[0_-2.22%_-6.85%_-2.22%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 188 156">
                  <g filter="url(#filter_rect14)">
                    <path d="M4 0H184V146H4V0Z" fill="#FEEAF3" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="156" id="filter_rect14" width="188" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="6" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Decorative blue rectangle (bottom-right, rotated -10deg) ===== */}
        <div className="absolute flex h-[220.136px] items-center justify-center left-[230px] top-[730px] w-[226.618px]">
          <div className="-rotate-10 flex-none">
            <div className="h-[188.828px] relative w-[196.819px]">
              <div className="absolute inset-[0_-2.03%_-5.3%_-2.03%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 204.819 198.828">
                  <g filter="url(#filter_rect15)">
                    <path d="M4 0H200.819V188.828H4V0Z" fill="#D1EEFE" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="198.828" id="filter_rect15" width="204.819" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="6" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Decorative yellow rectangle (bottom-center, rotated -4deg) ===== */}
        <div className="absolute flex h-[187.117px] items-center justify-center left-[123.75px] top-[830px] w-[239.221px]">
          <div className="-rotate-4 flex-none">
            <div className="h-[171.644px] relative w-[227.803px]">
              <div className="absolute inset-[0_-1.76%_-5.83%_-1.76%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 235.803 181.644">
                  <g filter="url(#filter_rect16)">
                    <path d="M4 0H231.803V171.644H4V0Z" fill="#FFFCE9" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="181.644" id="filter_rect16" width="235.803" x="0" y="0">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                      <feOffset dy="6" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
