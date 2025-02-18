"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(5).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Move to next input if value is entered
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = verificationCode.join("")
    console.log("Verification code:", code)
    // Add your verification logic here
  }

  const handleResend = () => {
    console.log("Resending verification email")
    // Add your resend logic here
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Confirmation%20Token-322fKPRjMpvLIIVaWomNdDY5ZQf3wi.png"
          alt="High Tech Logo"
          width={100}
          height={100}
          className="h-12 w-auto"
        />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            S&apos;il vous plait checker vos email
          </h1>
          <p className="text-gray-600 text-center">
            Votre compte a été créer avec succes. Un email de confirmation vous a ete envoyé
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-lg"
                  aria-label={`Digit ${index + 1} of verification code`}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Connexion
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Je n&apos;ai pas recu de mail ! </span>
              <button
                type="button"
                onClick={handleResend}
                className="text-black underline hover:text-gray-600"
              >
                Renvoyez
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}