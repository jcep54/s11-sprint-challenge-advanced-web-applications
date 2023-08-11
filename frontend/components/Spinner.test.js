// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react"
import Spinner from "./Spinner"
import { rerender, render, screen } from "@testing-library/react"

test('sanity', () => {
  const rerender = render(<Spinner on ={true}/>)
  const message = screen.getByText('Please wait')
  expect(message).toBeInTheDocument()
  rerender(<Spinner on ={false}/>)
  expect(message).not.toBeInTheDocument()

})
