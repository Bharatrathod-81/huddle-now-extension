import React, { useEffect, useState } from "react";
import { Button, ButtonText, Excerpt, Form, FormWrapper, Icon, Inputfield, Label, Note, Title, Wrapper, Link, Error, Logo } from "./Email-verification.styles";
import getAllowedEmailDomainRegex from "../../component/common/allowedEmailDominList";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../atom/LoadingAtom/useLoading";
import icon from '../../asset/Group 602.png';
import pizzle from '../../asset/puzzle-piece.png';
import { setToken, tokenAtom } from "../../atom/LoginAtom/useLoginAtom";
import { useAtom } from "jotai";

const EmailVerification = () => {

    const {id} = useParams();
    const {extensionId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [userData] = useAtom(tokenAtom);
    const {startLoading, stopLoading } = useLoading();
    const [inputValues, setInputValues] = useState({isValid:false, value:'', isClicked:false});

    const changeHandler = (event) => {
        const value = event.target.value;
        const isValid = getAllowedEmailDomainRegex().test(value);
        setInputValues(prev => ({...prev, isValid, value}));
    };

    const clickHandler = () => {
        setInputValues(prev => ({...prev, isClicked:true}));
        if(inputValues.isValid && inputValues.value){
            submitHandler();
        }
    };

    const submitHandler = () => {
        const data = {email:inputValues.value};
            if(id){
                data.sessionId = id;
            }

            startLoading();
            axios.post('http://localhost:4000/api/auth/linkshare',data).then(res => {
                setToken({...userData, email:inputValues.value});
                stopLoading();
                navigate("/EmailInfo");
            }).catch(err => {
                stopLoading();
                console.log(err)
            })
    };

    useEffect(() => {
        if(extensionId){
            setToken({...userData, extensionId});
        }
    },[])

    return(
    <Wrapper>
        {location?.pathname?.includes('firstLogin') && <div className="flex w-[502px] border-2 border-teal-300 bg-teal-50 py-4 px-7 rounded absolute top-0 right-0 m-7 text-base font-medium text-gray-500"><div>Keep <span className="font-bold text-teal-600">Huddle Now</span> handy! Pin it to your browser extension panel <img className="inline w-6 h-6" alt="icon" src={pizzle}/> for instant access.</div><img className="h-10 ml-2" alt="icon" src={icon}/></div>}
        <FormWrapper>
            <Form onSubmit={e => e.preventDefault()}>
                <Logo>
                    <svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_264_3149)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.8179 12.6236C35.1649 12.4724 34.4616 12.5228 33.8085 12.5732C33.3062 12.6236 33.1052 12.9764 33.1052 13.4803C33.1052 14.2866 33.1052 15.0929 33.1052 15.8992C33.055 16.1512 33.0047 16.5039 32.9043 16.7559C32.5024 17.5622 31.6986 17.9653 30.8446 17.7638C29.9906 17.5622 29.438 16.9071 29.3878 15.8992C29.3376 15.0425 29.3878 14.2362 29.3878 13.3795C29.438 12.0693 28.785 11.1622 27.6295 10.6079C26.4741 10.0535 25.3187 10.0031 24.1131 10.2551C22.6562 10.5071 21.1994 11.6157 21.4003 13.6819C21.4003 13.9339 21.4003 14.1858 21.4003 14.4378C21.4003 14.9417 21.4003 15.3953 21.4003 15.8992C21.3501 17.0079 20.5966 17.7638 19.5416 17.7638C18.4867 17.7638 17.7332 16.9575 17.7332 15.8488C17.7332 15.0425 17.7834 14.1858 17.7332 13.3795C17.6829 13.1276 17.5322 12.7748 17.3313 12.674C16.3768 12.3213 15.0204 12.3213 14.1162 13.0268C13.7143 12.674 13.1617 12.4724 12.6091 12.422C13.011 11.9181 13.6138 11.4646 14.3674 11.1622C13.1617 10.4063 12.5087 9.44881 12.5087 8.08818C12.5087 7.18109 12.8603 6.42519 13.4631 5.77007C14.719 4.40944 16.8289 4.35905 18.1853 5.61889C18.989 6.37479 19.3407 7.33228 19.2402 8.44094C19.1398 9.5496 18.5872 10.3559 17.6829 11.011C17.8839 11.1118 18.0346 11.1622 18.1853 11.2126C18.9388 11.515 19.2402 11.9685 19.2402 12.7748C19.2402 13.6315 19.2402 14.4882 19.2402 15.3449C19.2402 15.4457 19.19 15.5968 19.2402 15.6976C19.3407 15.8488 19.4914 15.9496 19.5919 16.1008C19.6923 16 19.8933 15.8488 19.8933 15.6976C19.9435 14.9417 19.9435 14.1354 19.8933 13.3795C19.7426 11.5653 20.6971 10.3559 22.1539 9.4992C22.4553 9.34802 22.7567 9.19684 23.1084 8.99527C21.6515 8.03779 20.7975 6.72755 20.7975 4.96377C20.7975 3.75432 21.2496 2.64566 22.1036 1.73857C23.9121 -0.125992 26.9263 -0.176386 28.7347 1.68818C29.7897 2.79684 30.2418 4.10708 30.0408 5.61889C29.8399 7.1307 29.0361 8.23936 27.8305 9.04566C28.4836 9.44881 29.0864 9.80157 29.639 10.2551C30.5432 10.9606 31.0456 11.9181 30.9953 13.1276C30.9451 13.9339 30.9451 14.7905 30.9953 15.5968C30.9953 15.7984 31.1963 15.9496 31.2967 16.1512C31.3972 15.9496 31.5982 15.748 31.5982 15.5464C31.5982 14.7401 31.5982 13.9842 31.5982 13.1779C31.5982 11.8173 31.7991 11.515 33.1554 11.011C31.9498 10.1039 31.3972 8.94487 31.6484 7.48346C31.7991 6.57637 32.3014 5.92125 33.0047 5.36692C34.4616 4.30865 36.5212 4.61102 37.6264 6.02204C38.9325 7.68503 38.5306 9.5496 36.5715 11.2126C37.2748 11.515 37.8273 11.9181 38.2292 12.422C37.7269 12.5228 37.2245 12.8252 36.8729 13.1779C36.6217 12.926 36.2701 12.7244 35.8179 12.6236ZM17.7834 8.18897C17.7834 7.18109 16.9294 6.27401 15.9247 6.27401C14.8697 6.27401 14.0157 7.1307 14.0157 8.13857C14.0157 9.14645 14.8195 10.0031 15.8744 10.0031C16.8792 10.0535 17.7332 9.19684 17.7834 8.18897ZM28.5338 4.96377C28.5338 3.25039 27.1272 1.83936 25.4192 1.83936C23.7112 1.83936 22.3046 3.25039 22.3046 4.96377C22.3046 6.72755 23.7112 8.13857 25.4192 8.13857C27.1774 8.13857 28.584 6.72755 28.5338 4.96377ZM36.7724 8.18897C36.7724 7.18109 35.9686 6.3244 34.9639 6.3244C34.0095 6.27401 33.1052 7.18109 33.1052 8.18897C33.1052 9.19684 34.0095 10.0031 35.0142 10.0031C36.0189 10.0031 36.8226 9.14645 36.7724 8.18897Z" fill="url(#paint0_linear_264_3149)"/>
                    <path d="M0.301392 7.08032H4.67188V15.6473C5.52588 14.8913 6.37988 14.337 7.28412 13.9843C8.13813 13.6315 9.04236 13.4299 9.9466 13.4299C11.7048 13.4299 13.1617 14.0347 14.3171 15.2441C15.3218 16.3024 15.8242 17.8142 15.8242 19.8299V31.4205H11.5039V23.7102C11.5039 21.6945 11.4034 20.2835 11.2025 19.578C11.0015 18.8724 10.7001 18.3181 10.1978 17.9654C9.74566 17.6126 9.14284 17.411 8.48977 17.411C7.58554 17.411 6.832 17.7134 6.17894 18.3181C5.52588 18.9228 5.07376 19.7291 4.87282 20.737C4.72211 21.241 4.67188 22.4504 4.67188 24.3654V31.4205H0.301392V7.08032Z" fill="#059669"/>
                    <path d="M30.7441 19.9811C29.7896 19.9811 29.0361 19.5779 28.4333 18.9732V20.5354C28.4333 22.1984 28.3328 25.1716 28.1821 25.726C27.9309 26.3811 27.5793 26.9354 27.0267 27.2882C26.5243 27.6409 25.8713 27.7921 25.168 27.7921C24.4144 27.7921 23.8116 27.5905 23.3093 27.2378C22.8069 26.885 22.4553 26.3811 22.2041 25.726C22.0031 25.0709 21.8524 21.9968 21.8524 20.3842V18.7213C21.2496 19.2252 20.4961 19.5779 19.6923 19.5779C18.7881 19.5779 17.9843 19.1748 17.3815 18.5701V19.2252C17.3815 22.0472 17.5322 25.8772 17.8838 26.9354C18.3862 28.4976 19.1899 29.6567 20.3956 30.5134C21.6012 31.3701 23.1586 31.8236 25.0675 31.8236C26.8257 31.8236 28.2826 31.4709 29.438 30.715C30.5934 29.959 31.4474 28.9008 32.0502 27.5401C32.5526 26.4315 32.7535 22.4 32.7535 19.326V19.1244C32.2512 19.6787 31.4976 19.9811 30.7441 19.9811Z" fill="#059669"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M51.9435 7.08032V31.4205H47.5228V29.5559C46.6688 30.3622 45.8147 30.9669 44.9607 31.3197C44.1067 31.6724 43.1523 31.874 42.1476 31.874C39.887 31.874 37.9278 31.0173 36.27 29.2536C34.6122 27.4898 33.8085 25.3228 33.8085 22.7024C33.8085 19.9811 34.6122 17.7638 36.2198 16.0504C37.8273 14.337 39.7363 13.4299 42.0471 13.4299C43.102 13.4299 44.1067 13.6315 45.011 14.0347C45.9152 14.4378 46.7692 15.0425 47.573 15.8488V7.08032H51.9435ZM42.9011 17.4614C41.5447 17.4614 40.3893 17.9654 39.5353 18.9228C38.6311 19.8803 38.179 21.1402 38.179 22.652C38.179 24.1638 38.6311 25.4236 39.5353 26.3811C40.4396 27.3386 41.595 27.8425 42.9011 27.8425C44.2575 27.8425 45.4129 27.3386 46.3171 26.3811C47.2213 25.4236 47.6735 24.1638 47.6735 22.6016C47.6735 21.0898 47.2213 19.8299 46.3171 18.8724C45.4631 17.9654 44.3077 17.4614 42.9011 17.4614Z" fill="#059669"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M71.0831 7.08032V31.4205H66.6624V29.5559C65.8084 30.3622 64.9544 30.9669 64.1004 31.3197C63.2464 31.6724 62.2919 31.874 61.2872 31.874C59.0266 31.874 57.0674 31.0173 55.4097 29.2536C53.7519 27.4898 52.9481 25.3228 52.9481 22.7024C52.9481 19.9811 53.7519 17.7638 55.3594 16.0504C56.967 14.337 58.8759 13.4299 61.1867 13.4299C62.2417 13.4299 63.2464 13.6315 64.1506 14.0347C65.0549 14.4378 65.9089 15.0425 66.7126 15.8488V7.08032H71.0831ZM62.0407 17.4614C60.6844 17.4614 59.529 17.9654 58.675 18.9228C57.7707 19.8803 57.3186 21.1402 57.3186 22.652C57.3186 24.1638 57.7707 25.4236 58.675 26.3811C59.5792 27.3386 60.7346 27.8425 62.0407 27.8425C63.3971 27.8425 64.5525 27.3386 65.4568 26.3811C66.361 25.4236 66.8131 24.1638 66.8131 22.6016C66.8131 21.0898 66.361 19.8299 65.4568 18.8724C64.5525 17.9654 63.4473 17.4614 62.0407 17.4614Z" fill="#059669"/>
                    <path d="M72.3893 7.08032H76.7598V31.4205H72.3893V7.08032Z" fill="#059669"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M95.6484 23.9118H81.5322C81.7332 25.1716 82.2858 26.1795 83.19 26.885C84.0942 27.6409 85.1994 27.9937 86.5558 27.9937C88.2135 27.9937 89.6201 27.4394 90.7755 26.2803L94.493 28.0441C93.5887 29.3543 92.4836 30.3118 91.1774 30.9669C89.8713 31.5716 88.3642 31.9244 86.606 31.9244C83.843 31.9244 81.6327 31.0677 79.8745 29.3039C78.1664 27.5401 77.2622 25.3732 77.2622 22.7527C77.2622 20.0819 78.1162 17.8646 79.8242 16.0504C81.5322 14.2866 83.6923 13.3795 86.3046 13.3795C89.0675 13.3795 91.3281 14.2866 93.0361 16.0504C94.7441 17.8142 95.6484 20.1827 95.6484 23.0551V23.9118ZM91.2779 20.4346C90.9765 19.4772 90.4239 18.6709 89.5699 18.0661C88.7159 17.4614 87.7112 17.159 86.606 17.159C85.4003 17.159 84.2952 17.5118 83.3909 18.2173C82.7881 18.6709 82.2858 19.4268 81.7834 20.485H91.2779V20.4346Z" fill="#059669"/>
                    <path d="M98.7629 13.833H101.024V16.9574C101.928 15.748 102.932 14.8409 104.038 14.2362C105.143 13.6315 106.348 13.3291 107.604 13.3291C108.911 13.3291 110.066 13.6819 111.071 14.337C112.075 14.9921 112.829 15.8992 113.331 17.0582C113.834 18.1669 114.035 19.9307 114.035 22.3496V31.37H111.774V23.0047C111.774 20.9889 111.673 19.6283 111.523 18.9732C111.272 17.8141 110.769 16.9574 110.016 16.3527C109.262 15.748 108.308 15.496 107.102 15.496C105.746 15.496 104.54 15.9496 103.435 16.8567C102.38 17.7637 101.626 18.8724 101.325 20.233C101.124 21.0897 101.024 22.7023 101.024 25.0204V31.4708H98.7629V13.833Z" fill="#059669"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M124.534 13.3795C127.246 13.3795 129.457 14.337 131.265 16.3024C132.873 18.0661 133.677 20.1827 133.677 22.652C133.677 25.1212 132.823 27.2378 131.115 29.1024C129.407 30.9165 127.196 31.874 124.534 31.874C121.821 31.874 119.661 30.9669 117.953 29.1024C116.245 27.2882 115.391 25.1212 115.391 22.652C115.391 20.2331 116.195 18.1165 117.802 16.3024C119.56 14.3874 121.821 13.3795 124.534 13.3795ZM124.534 15.5968C122.675 15.5968 121.067 16.3024 119.711 17.663C118.355 19.074 117.702 20.737 117.702 22.7024C117.702 23.9622 118.003 25.1716 118.606 26.2803C119.209 27.389 120.063 28.2457 121.118 28.8C122.173 29.4047 123.328 29.7071 124.584 29.7071C125.84 29.7071 126.995 29.4047 128.05 28.8C129.105 28.1953 129.909 27.3386 130.562 26.2803C131.165 25.1716 131.466 24.0126 131.466 22.7024C131.466 20.737 130.813 19.074 129.457 17.663C128 16.3024 126.392 15.5968 124.534 15.5968Z" fill="#059669"/>
                    <path d="M132.823 13.833H135.133L140.509 26.5826L146.085 13.833H146.487L152.113 26.5826L157.589 13.833H159.95L152.364 31.4204H151.962L146.336 18.822L140.76 31.4204H140.308L132.823 13.833Z" fill="#059669"/>
                    </g>
                    <defs>
                    <linearGradient id="paint0_linear_264_3149" x1="12.5338" y1="0.302354" x2="38.3799" y2="0.302354" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0DBDEE"/>
                    <stop offset="0.864" stop-color="#C0C930"/>
                    <stop offset="1" stop-color="#7EC142"/>
                    </linearGradient>
                    <clipPath id="clip0_264_3149">
                    <rect width="160" height="32" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                </Logo>
                <Title>Verify your email</Title>
                <Excerpt>Gotta verify your email to proceed with Huddle Now</Excerpt>
                <Label>Email</Label>
                <Inputfield placeholder="john@doe.com" type='email' value={inputValues.value} defaultValue={inputValues.value} onChange={changeHandler} name='email'/>
                {(!inputValues.isValid && inputValues.isClicked) && <Error>Enter your valid email</Error>}
                <Button onClick={clickHandler}>
                    <Icon>
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3132 15.9038L9.5 18.75L8.6868 15.9038C8.25968 14.4089 7.09112 13.2403 5.59619 12.8132L2.75 12L5.59619 11.1868C7.09113 10.7597 8.25968 9.59112 8.6868 8.09619L9.5 5.25L10.3132 8.09619C10.7403 9.59113 11.9089 10.7597 13.4038 11.1868L16.25 12L13.4038 12.8132C11.9089 13.2403 10.7403 14.4089 10.3132 15.9038Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.7589 8.71454L18.5 9.75L18.2411 8.71454C17.9388 7.50533 16.9947 6.56117 15.7855 6.25887L14.75 6L15.7855 5.74113C16.9947 5.43883 17.9388 4.49467 18.2411 3.28546L18.5 2.25L18.7589 3.28546C19.0612 4.49467 20.0053 5.43883 21.2145 5.74113L22.25 6L21.2145 6.25887C20.0053 6.56117 19.0612 7.50533 18.7589 8.71454Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.3942 20.5673L17 21.75L16.6058 20.5673C16.3818 19.8954 15.8546 19.3682 15.1827 19.1442L14 18.75L15.1827 18.3558C15.8546 18.1318 16.3818 17.6046 16.6058 16.9327L17 15.75L17.3942 16.9327C17.6182 17.6046 18.1454 18.1318 18.8173 18.3558L20 18.75L18.8173 19.1442C18.1454 19.3682 17.6182 19.8954 17.3942 20.5673Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </Icon>
                    <ButtonText>Send magic link</ButtonText>
                </Button>
            </Form>
            <Note>
                By continuing, you accept Huddle's <Link href="#">Terms of service</Link> and <Link href="#">Privacy policy</Link>.
            </Note>
        </FormWrapper>
    </Wrapper>
    )

}

export default EmailVerification;