import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import svgPaths from "./svg-paths";
import imgPaper21 from "../LandingPage/9600d715b43f7d60b6c4a7bbdc9c2c66b3288cdd.png";
import imgImage6 from "../LandingPage/10e09fc392a8b074791b0ec683f23a90ba0a73b6.png";
import imgImage8 from "../LandingPage/45238b0bccc8e5bfd9ca5116b13594d7c28bf341.png";
import imgImage9 from "../LandingPage/80e090bbb4cf707b84d8191d389f1f6fec8e8528.png";

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/signin` },
    });
    if (error) {
      setError(error.message);
    } else {
      setEmailSent(true);
    }
  };

  return (
    /* ===== Full-screen centering wrapper ===== */
    <div className="size-full flex items-center justify-center bg-gray-100">

      {/* ===== iPhone 17 frame — fixed 402x874 with overflow hidden to clip overflowing decorations ===== */}
      <div
        className="relative bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        style={{ width: 402, height: 874, overflow: "hidden" }}
      >

        {/* ===== Paper texture background — large tiled image behind everything ===== */}
        <div
          className="absolute bg-size-[834px_1078.5px] bg-top-left h-[2157px] left-[-599px] top-[-1059px] w-[1668px]"
          style={{ backgroundImage: `url('${imgPaper21}')` }}
        />

        {/* ===== Large green star (top-left decorative, rotated 15deg, semi-transparent) ===== */}
        <div className="absolute flex h-[427px] items-center justify-center left-[-91.04px] top-[-107px] w-[417.041px]">
          <div className="flex-none rotate-15">
            <div className="h-[351.62px] relative w-[337.536px]">
              <div className="absolute inset-[0_1.26%_7.27%_1.26%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 329.016 326.044">
                  <g filter="url(#filter_star_green)">
                    <path d={svgPaths.pfb34f00} fill="#ACD8A7" fillOpacity="0.533333" shapeRendering="crispEdges" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="326.044" id="filter_star_green" width="329.016" x="0" y="0">
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

        {/* ===== Rotated map image (top-right, behind content, rotated -60deg, semi-transparent) ===== */}
        <div className="absolute flex h-[727.025px] items-center justify-center left-[186px] top-[-557px] w-[588.876px]">
          <div className="-rotate-60 flex-none">
            <div className="h-[292.937px] opacity-40 relative w-[670.369px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage6} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Title letter card backgrounds — tan "sticky note" cards behind each letter ===== */}
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
                  <g filter="url(#filter_card6)">
                    <path d="M4 0H71.9128V75.8324H4V0Z" fill="#EEE1D0" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="83.8324" id="filter_card6" width="75.9128" x="0" y="0">
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

        {/* ===== Title letters — "SightLinE" each in a unique decorative font ===== */}
        <p className="absolute font-['Irish_Grover'] h-[59px] leading-[normal] left-[42px] not-italic text-[#452d2d] text-[60px] top-[75px] w-[55px]">S</p>
        <p className="absolute font-['Inika'] h-[53px] leading-[normal] left-[84px] not-italic text-[#452d2d] text-[60px] top-[89px] w-[33px]">I</p>
        <p className="absolute font-['Jacques_Francois_Shadow'] h-[59px] leading-[normal] left-[112px] not-italic text-[#452d2d] text-[60px] top-[63px] w-[55px]">g</p>
        <p className="absolute font-['JejuHallasan'] h-[59px] leading-[normal] left-[150px] not-italic text-[#452d2d] text-[60px] top-[74px] w-[55px]">h</p>
        <p className="absolute font-['Gugi'] h-[59px] leading-[normal] left-[190px] not-italic text-[#452d2d] text-[60px] top-[89px] w-[55px]">t</p>
        <p className="absolute font-['Jacques_Francois_Shadow'] h-[59px] leading-[normal] left-[215px] not-italic text-[#452d2d] text-[60px] top-[64px] w-[55px]">L</p>
        <p className="absolute font-['Jaini_Purva'] h-[59px] leading-[normal] left-[263px] not-italic text-[#452d2d] text-[60px] top-[76px] w-[55px]">i</p>
        <p className="absolute font-['Griffy'] h-[59px] leading-[normal] left-[280px] not-italic text-[#452d2d] text-[60px] top-[81px] w-[55px]">N</p>
        <p className="absolute font-['Germania_One'] h-[59px] leading-[normal] left-[330px] not-italic text-[#452d2d] text-[60px] top-[72px] w-[55px]">E</p>

        {/* ===== Yellow star (top-right decorative, rotated -20deg, semi-transparent) ===== */}
        <div className="absolute flex h-[128.041px] items-center justify-center left-[287px] top-[168px] w-[127.934px]">
          <div className="-rotate-20 flex-none">
            <div className="h-[99.947px] relative w-[99.767px]">
              <div className="absolute inset-[0_-1.56%_1.54%_-1.56%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102.884 98.4025">
                  <g filter="url(#filter_star_yellow)">
                    <path d={svgPaths.p1aa95f80} fill="#FFE9AE" fillOpacity="0.596078" shapeRendering="crispEdges" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="98.4025" id="filter_star_yellow" width="102.884" x="0" y="0">
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

        {/* ===== Sign-up form card — white rounded rectangle with drop shadow ===== */}
        <div className="absolute h-[333px] left-[37px] top-[227px] w-[327px]">
          <div className="absolute inset-[0_-1.22%_-3%_-1.22%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 335 343">
              <g filter="url(#filter_form_card)">
                <path d={svgPaths.paf73200} fill="white" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="343" id="filter_form_card" width="335" x="0" y="0">
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

        {/* ===== Email input field (rounded pill with inner shadow) ===== */}
        <div className="absolute h-[53px] left-[49px] top-[270px] w-[304px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 304 53">
            <g filter="url(#filter_input_email)">
              <path d={svgPaths.p14459f0} fill="#FFFCE9" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57" id="filter_input_email" width="304" x="0" y="0">
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
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="absolute bg-transparent font-['Hi_Melody'] text-[#452d2d] text-[28px] outline-none"
          style={{ left: 70, top: 283, width: 270, height: 46 }}
        />

        {/* ===== Password input field (rounded pill with inner shadow) ===== */}
        <div className="absolute h-[53px] left-[49px] top-[353px] w-[304px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 304 53">
            <g filter="url(#filter_input_pw)">
              <path d={svgPaths.p14459f0} fill="#FFFCE9" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57" id="filter_input_pw" width="304" x="0" y="0">
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
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="absolute bg-transparent font-['Hi_Melody'] text-[#452d2d] text-[28px] outline-none"
          style={{ left: 70, top: 366, width: 270, height: 46 }}
        />

        {/* ===== Confirm Password input field (rounded pill with inner shadow) ===== */}
        <div className="absolute h-[53px] left-[49px] top-[427px] w-[304px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 304 53">
            <g filter="url(#filter_input_cpw)">
              <path d={svgPaths.p14459f0} fill="#FFFCE9" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57" id="filter_input_cpw" width="304" x="0" y="0">
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
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="absolute bg-transparent font-['Hi_Melody'] text-[#452d2d] text-[28px] outline-none"
          style={{ left: 70, top: 437, width: 270, height: 46 }}
        />

        {/* ===== Sign Up button (gradient pill with drop shadow, pink-to-blue) ===== */}
        <div className="absolute h-[43px] left-[127px] top-[502px] w-[148px]">
          <div className="absolute inset-[0_-2.7%_-23.26%_-2.7%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156 53">
              <g filter="url(#filter_signup_btn)">
                <path d={svgPaths.p1e8d0a80} fill="#FFFCE9" />
                <path d={svgPaths.p1e8d0a80} fill="url(#paint_signup)" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53" id="filter_signup_btn" width="156" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="6" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint_signup" x1="4" x2="152" y1="21.5" y2="21.5">
                  <stop stopColor="#FEEAF3" />
                  <stop offset="1" stopColor="#D1EEFE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <button
          onClick={handleSignUp}
          className="absolute font-['Hi_Melody'] text-[#452d2d] text-[30px] bg-transparent border-none cursor-pointer"
          style={{ left: 'calc(50% - 37px)', top: 508, width: 105, height: 50 }}
        >
          Sign Up
        </button>

        {error && (
          <p className="absolute font-['Hi_Melody'] text-red-500 text-[16px] text-center" style={{ left: 49, top: 565, width: 304 }}>
            {error}
          </p>
        )}

        {emailSent && (
          <p className="absolute font-['Hi_Melody'] text-green-700 text-[16px] text-center" style={{ left: 49, top: 565, width: 304 }}>
            Check your email for a confirmation link!
          </p>
        )}

        {/* ===== Paperclip image (right side, rotated 100deg) ===== */}
        <div className="absolute flex h-[71.725px] items-center justify-center left-[286.2px] top-[522.45px] w-[38.613px]">
          <div className="flex-none rotate-100">
            <div className="h-[27.213px] relative w-[68.033px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage8} />
            </div>
          </div>
        </div>

        {/* ===== Map image (bottom area, rotated -8deg, semi-transparent background) ===== */}
        <div className="absolute flex h-[674.985px] items-center justify-center left-[-63px] top-[524.31px] w-[1006.426px]">
          <div className="-rotate-8 flex-none">
            <div className="h-[549.641px] opacity-40 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[939.07px]" />
          </div>
        </div>

        {/* ===== "Sign In" link with underline in a white pill ===== */}
        <Link to="/signin" className="absolute bg-white h-[44px] left-[76px] rounded-[10px] shadow-[0px_6px_4px_0px_rgba(0,0,0,0.25)] top-[606px] w-[250px] cursor-pointer hover:opacity-90 transition-opacity" />
        <Link to="/signin" className="absolute decoration-solid font-['Hi_Melody'] h-[50px] leading-[normal] left-[167px] not-italic text-[#452d2d] text-[30px] top-[610px] underline w-[188px] cursor-pointer hover:opacity-90 transition-opacity">Sign In</Link>

        {/* ===== Small blue star (bottom-right decorative, rotated 15deg) ===== */}
        <div className="absolute flex h-[117.119px] items-center justify-center left-[295px] top-[609.5px] w-[120.135px]">
          <div className="flex-none rotate-15">
            <div className="h-[94.726px] relative w-[98.991px]">
              <div className="absolute inset-[0_-1.59%_1.1%_-1.59%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102.146 93.6806">
                  <g filter="url(#filter_star_blue)">
                    <path d={svgPaths.p17d2e100} fill="#D1EEFE" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="93.6806" id="filter_star_blue" width="102.146" x="0" y="0">
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

        {/* ===== Push pin image (top-right corner, rotated -17deg) ===== */}
        <div className="absolute flex items-center justify-center left-[311px] size-[136.256px] top-[111px]">
          <div className="flex-none rotate-[-17.12deg]">
            <div className="relative size-[109px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage9} />
            </div>
          </div>
        </div>

        {/* ===== Push pin image (bottom-left, flipped/rotated) ===== */}
        <div className="absolute flex items-center justify-center left-[-18px] size-[109px] top-[652px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="relative size-[109px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage9} />
            </div>
          </div>
        </div>

        {/* ===== Decorative blue rectangle (bottom-left, rotated -10deg) ===== */}
        <div className="absolute flex h-[220.136px] items-center justify-center left-[-5px] top-[704px] w-[226.618px]">
          <div className="-rotate-10 flex-none">
            <div className="h-[188.828px] relative w-[196.819px]">
              <div className="absolute inset-[0_-2.03%_-5.3%_-2.03%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 204.819 198.828">
                  <g filter="url(#filter_rect_blue)">
                    <path d="M4 0H200.819V188.828H4V0Z" fill="#D1EEFE" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="198.828" id="filter_rect_blue" width="204.819" x="0" y="0">
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

        {/* ===== Decorative pink rectangle (bottom-right, rotated 10deg) ===== */}
        <div className="absolute flex h-[175.039px] items-center justify-center left-[224px] top-[704px] w-[202.618px]">
          <div className="flex-none rotate-10">
            <div className="h-[146px] relative w-[180px]">
              <div className="absolute inset-[0_-2.22%_-6.85%_-2.22%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 188 156">
                  <g filter="url(#filter_rect_pink)">
                    <path d="M4 0H184V146H4V0Z" fill="#FEEAF3" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="156" id="filter_rect_pink" width="188" x="0" y="0">
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
        <div className="absolute flex h-[187.117px] items-center justify-center left-[116px] top-[780px] w-[239.221px]">
          <div className="-rotate-4 flex-none">
            <div className="h-[171.644px] relative w-[227.803px]">
              <div className="absolute inset-[0_-1.76%_-5.83%_-1.76%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 235.803 181.644">
                  <g filter="url(#filter_rect_yellow)">
                    <path d="M4 0H231.803V171.644H4V0Z" fill="#FFFCE9" />
                  </g>
                  <defs>
                    <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="181.644" id="filter_rect_yellow" width="235.803" x="0" y="0">
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
