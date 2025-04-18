import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({ couponDiscount = 0 }) => {
  
  const { currency, shipmentFee, getCartAmount, platformFee, } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const discountAmount = (subtotal * couponDiscount) / 100;
  const total = subtotal + Number(shipmentFee || 0) + Number(platformFee || 0) - discountAmount;


  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {subtotal.toFixed(2)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency} {Number(shipmentFee || 0).toFixed(2)}
          </p>
        </div>

        <div className='flex justify-between'>
          <p>Platform Fee</p>
          <p>{currency} {Number(platformFee || 0).toFixed(2)}
          </p>
        </div>
        {couponDiscount > 0 && (
          <>
            <hr />
            <div className='flex justify-between text-green-600'>
              <p>Coupon Discount ({couponDiscount}%)</p>
              <p>- {currency} {discountAmount.toFixed(2)}</p>
            </div>
          </>
        )}
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {subtotal === 0 ? 0 : total.toFixed(2)}</b>
        </div>
      </div>
    </div>
  );
};


export default CartTotal
