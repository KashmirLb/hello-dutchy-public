"use client"
import { useEffect, useRef, useState} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { set, z } from 'zod'
import Link from 'next/link'

import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"

import { Input } from "../ui/input"
import * as React from "react"

import IntlTelInput, { type IntlTelInputRef } from "intl-tel-input/react";
import "intl-tel-input/styles";
import type { Order } from '@prisma/client'
import useLanguage from '~/hooks/useLanguage'

// type StateFetch = {
//   name: string,
//   state_code: string
// }

const OrderFormSchema = z.object({
  firstName: z.string().min(1,{ message: "Name is too short"}).max(50, { message: "Name is too long"}),
  lastName: z.string().min(2,{ message: "Last name is too short"}).max(50, { message: "Name is too long"}),
  email: z.string().email("Invalid email").max(50, { message: "Email is too long"}),
  phone: z.string().min(10,{ message: "Phone number is too short"}).max(15, { message: "Phone number is too long"}),
  addressCity: z.string().min(2,{ message: "Please enter the name of your city"}).max(50, { message: "The city name is too long"}),
  addressLine1: z.string().min(2,{ message: "Address is too short"}).max(50, { message: "Address is too long"}),
  addressLine2: z.string(),
  addressPostalCode: z.string().min(2,{ message: "Please enter a valid postal code"}).max(15, { message: "Please enter a valid postal code"}),
  addressCountry: z.string().min(2,{ message: "Please select your country"}),
  addressState: z.string().min(2,{ message: "Please enter your province or state"}).max(50, { message: "Province or state name is too long"}),
  policyAccepted: z.literal<boolean>(true, { errorMap: () => ({ message: "Please accept our terms and conditions"}) })
})

type OrderFormProps = {
  orderData: Order | null,
  setOrderData: React.Dispatch<React.SetStateAction<Order | null>>,
  enLang: boolean,
  onSaveOrderData: () => void,
}
const OrderForm = ( {orderData, setOrderData, enLang, onSaveOrderData}: OrderFormProps ) => {

  const [ prevPhoneNumber, setPrevPhoneNumber ] = useState("")
  const [ policyAccepted, setPolicyAccepted ] = useState(false)
  const { mobileDevice } = useLanguage()
  const { languageData } = useLanguage()

  const phoneInputRef = useRef<IntlTelInputRef | null>(null)

  useEffect(() => {
    form.setValue("policyAccepted", policyAccepted)
    onChangeInputValue()
  },[policyAccepted])

  const form = useForm<z.infer<typeof OrderFormSchema>>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      firstName: orderData?.firstName ?? "",
      lastName: orderData?.lastName ?? "",
      phone: "",
      email: orderData?.email ?? "",
      addressCity: orderData?.addressCity ?? "",
      addressLine1: orderData?.addressLine1 ?? "",
      addressLine2: orderData?.addressLine2 ?? "",
      addressPostalCode: orderData?.addressPostalCode ?? "",
      addressCountry: orderData?.addressCountry ?? "",
      addressState: orderData?.addressState ?? "",
      policyAccepted: orderData?.policyAccepted ?? false,
    },
  })

  const onSubmit = (data: z.infer<typeof OrderFormSchema>) => {
    onChangeInputValue()
    onSaveOrderData()
  }

  const onChangePhoneNumber = (e: string) => {
    if(phoneInputRef.current != null){
      
      const Iti = phoneInputRef.current.getInstance()
      const phoneNumberEntered = phoneInputRef.current.getInput()?.value ?? ""
      const countrySelected = Iti?.getSelectedCountryData()?.dialCode ?? ""

      if((!phoneNumberEntered.match(/^\d+$/) && phoneNumberEntered.length > 0) || phoneNumberEntered.length > 10){
        Iti?.setNumber(prevPhoneNumber)
      }
      else{ 
        setPrevPhoneNumber(phoneNumberEntered)
        form.setValue("phone", "+" + countrySelected + phoneNumberEntered)
      }
    }
  }

  const onChangeInputValue = () => {
    
    const formValues = form.getValues()

    setOrderData((prevState: Order | null) => {
      if(prevState){
        return {...prevState, 
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phone: formValues.phone,
          addressCountry: formValues.addressCountry,
          addressState: formValues.addressState,
          addressCity: formValues.addressCity,
          addressPostalCode: formValues.addressPostalCode,
          addressLine1: formValues.addressLine1,
          addressLine2: formValues.addressLine2,
          policyAccepted: formValues.policyAccepted,
        }
      }
      else{
        return null
      }
    })
  }

  // const getStatesFromCountry = async (country: string) => {
  //   const response = await axiosGetStatesFromCountry.post("", { country: country } )
  //   try{
  //     setCountry(country)
  //     setStates(response.data.data.states.map((state: StateFetch) => state.name))
  //   }
  //   catch(e){
  //     console.log("Error")
  //   }
  // }

  // const getCitiesFromProvince = async (province: string) => {

  //   try{
  //     const response = await axiosGetCitiesFromProvince.post("", { country: country, state: `${province}` } )
  //     setProvince(province)
  //     setCities(response.data.data)
  //   }
  //   catch(e){
  //     console.log(e)
  //   }
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        className='bg-sky-100 p-4 text-primary-light flex flex-col gap-2'
      >
        <div className='text-primary border-b border-primary font-poppinsSemiBold text-xl mb-2 mt-4'>
          {languageData.orderHeaderText}
        </div>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'
              >{languageData.orderFirstName}</FormLabel>
              <FormControl>
                <Input className="text-primary text-base" type="text" {...field} placeholder={languageData.orderFirstNamePlaceholder} onKeyUp={() => onChangeInputValue()} />
              </FormControl>
              <FormDescription
                className='text-slate-500 text-xs'
              >
                
              </FormDescription>
              <FormMessage
                className='text-site-red'
              />
            </FormItem>
          )} 
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderLastName}</FormLabel>
              <FormControl>
                <Input className="text-primary text-base" type="text" {...field} placeholder={languageData.orderLastNamePlaceholder} onKeyUp={() => onChangeInputValue()} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )} 
        />
        <div className='text-primary border-b border-primary font-poppinsSemiBold text-xl mb-2 mt-6'>
          {languageData.orderContactInfoHeaderText}
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderEmail}</FormLabel>
              <FormControl>
                <Input className="text-primary text-base" type="email" {...field} placeholder='example@gmail.com' onKeyUp={() => onChangeInputValue()} />
              </FormControl>
              <FormDescription
                className='text-slate-500 text-xs'
              >
                {languageData.orderEmailDescription}
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )} 
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold block '>{languageData.orderPhone}</FormLabel>
              <FormControl>
                <IntlTelInput
                  inputProps={{
                    onKeyUp: () => onChangeInputValue()
                  }}
                  ref={phoneInputRef}
                  onChangeNumber={onChangePhoneNumber}
                  initOptions={{
                      separateDialCode: true,
                      allowDropdown: true,
                      useFullscreenPopup: mobileDevice,
                      initialCountry: "nl",
                  }}
                />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )} 
        />
        <div className='text-primary border-b border-primary font-poppinsSemiBold text-xl mb-2 mt-6'>
          {languageData.orderAddressHeaderText}
        </div>
        <FormField
          control={form.control}
          name="addressCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderAddressCountry}</FormLabel>
                <FormControl>
                  <select
                    className='country-select-form'
                    defaultValue={orderData?.addressCountry ?? ""}
                    onChange={(e) =>{ 
                      form.setValue("addressCountry", e.target.value)
                      onChangeInputValue()
                    }}
                  >
                    <option className='hover:bg-sky-100 cursor-pointer' value="">Please select your country</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="Netherlands">Netherlands</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="Belgium">Belgium</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="France">France</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="Germany">Germany</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="Luxemburg">Luxemburg</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="Spain">Spain</option>
                    <option className='hover:bg-sky-100 cursor-pointer' value="United Kingdom">United Kingdom</option>
                  </select>
                </FormControl>
              <FormDescription>
            
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressState"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderAddressProvince}</FormLabel>
                <FormControl>
                  <Input className="text-primary text-base" type="text" {...field} onKeyUp={() => onChangeInputValue()} />
                </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderAddressCity}</FormLabel>
                <FormControl>
                  <Input className="text-primary text-base" type="text" {...field} onKeyUp={() => onChangeInputValue()} />
                </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )} 
        />
        <FormField
          control={form.control}
          name="addressPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderAddressZipCode}</FormLabel>
              <FormControl>
                <Input className="text-primary text-base" type="text" {...field} onKeyUp={() => onChangeInputValue()} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderAddressFirstLine}</FormLabel>
              <FormControl>
                <Input className="text-primary text-base" type="text" {...field} onKeyUp={() => onChangeInputValue()} placeholder={languageData.orderAddressFirstLinePlaceholder}/>
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )} 
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className='text-lg tracking-wider font-poppinsSemiBold'>{languageData.orderAddressSecondLine}</FormLabel>
              <FormControl>
                <Input className="text-primary text-base" type="text" {...field} onKeyUp={() => onChangeInputValue()} placeholder={languageData.orderAddressSecondLinePlaceholder}/>
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )} 
        />
        <FormField
          control={form.control}
          name="policyAccepted"
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center gap-4 mt-4'>
                <input 
                  type="checkbox"
                  id="policyAccepted"
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="w-6 h-6 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-2 hover:cursor-pointer"
                 />
                <FormLabel
                  className='text-base tracking-wider font-poppinsSemiBold hover:cursor-pointer'
                  htmlFor="policyAccepted"
                >
                  {languageData.orderTermsAndConditions}
                </FormLabel>
              </div>
              <FormDescription>
                {languageData.orderTermsAndConditionsInfo}
                <Link href={"/privacy-policy"} className='text-navbar-blue underline'>{languageData.orderTermsAndConditionsLink}</Link>.
                {languageData.orderTermsAndConditionsInfo2}
              </FormDescription>
              <FormMessage
                className='text-site-red' />
            </FormItem>
          )}
        />   
        <div className='text-navbar-blue font-poppinsSemiBold text-2xl mb-2 mt-6'>
          {languageData.orderTotalPrice}: {orderData?.cost} €
        </div>  
        <Button type='submit'
          className='bg-navbar-blue hover:bg-secondary w-full text-site-white text-xl font-bold font-quicksand tracking-wider uppercase transition-all rounded-lg py-8 max-w-lg mx-auto' 
        >{enLang ? "Save" : "Opslaan"}</Button>
      </form>      
    </Form>
  )
}

export default OrderForm