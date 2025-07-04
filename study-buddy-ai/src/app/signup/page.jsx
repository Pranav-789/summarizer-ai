"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {useRouter} from "next/navigation"
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { BorderBeam } from '@/components/magicui/border-beam'
import toast, { Toaster } from 'react-hot-toast'

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: ""
  })

  useEffect(() => {
    if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
      setButtonDisabled(false)
    }
    else{
      setButtonDisabled(true)
    }
  }, [user])
  

  const onSignUp = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/api/users/signup", user);
      console.log("SignUp Success", response.data);
      router.push('/login');
      toast.success("SignUp successfull");
    } catch (error) {
      setLoading(false)
      console.log("Signup failed ", error.message)
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm relative z-10">
        <CardHeader>
          <Toaster position="top-center" reverseOrder={false} />
          <CardTitle>
            {loading ? "Processing" : "SignIn into your account"}
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/login">Log In</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  placeholder="username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={user.password}
                  placeholder="password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={onSignUp}>
            {buttonDisabled ? "No SignUp" : "SignUp"}
          </Button>
        </CardFooter>
        <BorderBeam size={100} duration={8} className="rounded-xl" />
      </Card>
    </div>
  );
}

export default page
