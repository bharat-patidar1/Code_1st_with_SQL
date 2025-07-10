import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Navbar from '../shared/Navbar'
import { ADMIN_API_END_POINT, Employee_API_END_POINT } from '@/utils/constant'
import { setLoading } from '@/redux/loadSlice'
import { useDispatch, useSelector } from 'react-redux'

export const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: ''
  })

  const { loading } = useSelector((store) => store.load)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  // dispatch(setLoading(false))
  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch(setLoading(true))
      const endpoint =
        input.role === 'Admin'
          ? `${ADMIN_API_END_POINT}/login`
          : `${Employee_API_END_POINT}/login`

      const res = await axios.post(endpoint, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })

      if (res.data.success) {
        toast.success(res.data.message)
        navigate(input.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed')
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center px-4 mt-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-gray-200 rounded-md p-6 shadow-sm"
        >
          <h1 className="font-bold text-xl mb-5 text-center">Login</h1>

          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={input.role === 'Admin'}
                onChange={changeEventHandler}
                className="accent-blue-600"
              />
              Admin
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Employee"
                checked={input.role === 'Employee'}
                onChange={changeEventHandler}
                className="accent-blue-600"
              />
              Employee
            </label>
          </div>

          {loading ? (
            <Button className="w-full my-3" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-3">
              Login
            </Button>
          )}

          <p className="text-sm text-center">
            Forgot your password?{' '}
            <Link to="/employee/forgetPassword" className="text-blue-500 underline">
              Reset Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
