import React, {useState} from "react";
import Carousel from 'react-bootstrap/Carousel';
import Image1 from './images/image1.jpg';
import Image2 from './images/image2.jpg';
import Image3 from './images/image3.jpg';

const data = [
  {
   image: Image3,
   caption:"Online Ethereum Lottery",
   description:"Try your luck, and win huge ethers"
  },
  {
    image: Image3,
    caption:"Secure and Safe",
    description:"All your transaction are safe with ethereum blockchain and for server errors you will get refunded back your money"
   },
   {
    image: Image3,
    caption:"Rules",
    description:"1st prize: 50%, 2nd prize: 25%, 3ed prize: 12.5% and 12.5% comission fees of manager"
   }
]

function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel  activeIndex={index} onSelect={handleSelect} interval={3500} pause={true}>
       {data.map((slide, i) => {
        return (
          <Carousel.Item style={{height: "500px"}}>
        <img
          className="d-block w-100"
          src={slide.image}
          alt="slider image"
        />
        <Carousel.Caption>
          <h2>{slide.caption}</h2>
          <h5>{slide.description}</h5>
        </Carousel.Caption>
      </Carousel.Item>
        )
      })}

    </Carousel>
  );
}
export default HomeCarousel;
