"use client"

import type React from "react"

import { useState } from "react"
import {  PenSquare, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FaRightLong } from "react-icons/fa6";

export default function StockManagement() {
  const [currentStock, setCurrentStock] = useState(300)
  const [displayStock, setDisplayStock] = useState(346)
  const [modifyAmount, setModifyAmount] = useState(46)
  const [minSaleQuantity, setMinSaleQuantity] = useState(46)
  const [stockLocation, setStockLocation] = useState("")
  const [emailAlertEnabled, setEmailAlertEnabled] = useState(true)
  const [thresholdValue, setThresholdValue] = useState("")
  const [stockBehavior, setStockBehavior] = useState("default")
  const [customValue1, setCustomValue1] = useState("")
  const [customValue2, setCustomValue2] = useState("")
  const [customDate, setCustomDate] = useState("")

  // Fonction pour ajouter ou soustraire des éléments
  const updateStock = (operation: "add" | "subtract") => {
    if (operation === "add") {
      setCurrentStock((prev) => prev + modifyAmount)
      setDisplayStock((prev) => prev + modifyAmount)
    } else {
      setCurrentStock((prev) => Math.max(0, prev - modifyAmount))
      setDisplayStock((prev) => Math.max(0, prev - modifyAmount))
    }
  }

  // Fonction pour incrémenter/décrémenter les valeurs numériques
  const incrementValue = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter((prev) => prev + 1)
  }

  const decrementValue = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="w-full max-w-3xl p-4">
      <h2 className="text-lg font-semibold mb-4">Stock</h2>

      <div className="space-y-6">
        {/* Modifier la quantité */}
        <div>
          <p className="mb-3">Modifier la quantité</p>

          <div className="flex items-center gap-4 mb-4">
            <span>{currentStock}</span>
            <div className="flex items-center">
              <FaRightLong className="w-5 h-5 text-[#7f1d1c] font-medium" />
              <span className="text-[#7f1d1c] font-medium ml-2">{displayStock}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>Ajouter ou soustraire des éléments</span>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStock("add")}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateStock("subtract")}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  -
                </button>
              </div>
            </div>
            <div className="relative w-[120px]">
              <Input
                type="text"
                value={modifyAmount}
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value)
                  if (!isNaN(val)) setModifyAmount(val)
                }}
                className="pr-8 text-right"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  className="h-3 flex items-center justify-center cursor-pointer"
                  onClick={() => incrementValue(setModifyAmount, modifyAmount)}
                >
                  <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 0L9.33013 5H0.669873L5 0Z" fill="#666" />
                  </svg>
                </button>
                <button
                  className="h-3 flex items-center justify-center cursor-pointer"
                  onClick={() => decrementValue(setModifyAmount, modifyAmount)}
                >
                  <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5L0.669873 0H9.33013L5 5Z" fill="#666" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quantité minimale pour la vente */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Quantité minimale pour la vente</span>
            <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs cursor-help">
              ?
            </div>
          </div>
          <div className="relative w-[120px]">
            <Input
              type="text"
              value={minSaleQuantity}
              onChange={(e) => {
                const val = Number.parseInt(e.target.value)
                if (!isNaN(val)) setMinSaleQuantity(val)
              }}
              className="pr-8 text-right"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button
                className="h-3 flex items-center justify-center cursor-pointer"
                onClick={() => incrementValue(setMinSaleQuantity, minSaleQuantity)}
              >
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 0L9.33013 5H0.669873L5 0Z" fill="#666" />
                </svg>
              </button>
              <button
                className="h-3 flex items-center justify-center cursor-pointer"
                onClick={() => decrementValue(setMinSaleQuantity, minSaleQuantity)}
              >
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5L0.669873 0H9.33013L5 5Z" fill="#666" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Emplacement du stock */}
        <div>
          <p className="mb-3">Emplacement du stock</p>
          <Input
            type="text"
            placeholder="Saisir l'emplacement du stock"
            className="w-full"
            value={stockLocation}
            onChange={(e) => setStockLocation(e.target.value)}
          />
        </div>

        {/* Recevoir une alerte par e-mail */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Recevoir une alerte par e-mail lorsque le stock est faible</span>
            <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs cursor-help">
              ?
            </div>
          </div>
          <Switch
            checked={emailAlertEnabled}
            onCheckedChange={setEmailAlertEnabled}
            className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c]"
          />
        </div>

        {/* Seuil */}
        <div>
          <div className="relative w-[180px]">
            <Input
              type="text"
              placeholder="Entre la valeur du seuil"
              className="pr-8"
              value={thresholdValue}
              onChange={(e) => setThresholdValue(e.target.value)}
              disabled={!emailAlertEnabled}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
              <button className="h-3 flex items-center justify-center cursor-pointer">
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 0L9.33013 5H0.669873L5 0Z" fill="#666" />
                </svg>
              </button>
              <button className="h-3 flex items-center justify-center cursor-pointer">
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5L0.669873 0H9.33013L5 5Z" fill="#666" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* En cas de rupture de stock */}
        <div>
          <p className="font-medium mb-3">En cas de rupture de stock</p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center cursor-pointer"
                onClick={() => setStockBehavior("refuse")}
              >
                {stockBehavior === "refuse" && <div className="w-3 h-3 rounded-full bg-[#7f1d1c]"></div>}
              </div>
              <Label htmlFor="refuse" className="cursor-pointer" onClick={() => setStockBehavior("refuse")}>
                Refuser les commandes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center cursor-pointer"
                onClick={() => setStockBehavior("accept")}
              >
                {stockBehavior === "accept" && <div className="w-3 h-3 rounded-full bg-[#7f1d1c]"></div>}
              </div>
              <Label htmlFor="accept" className="cursor-pointer" onClick={() => setStockBehavior("accept")}>
                Accepter les commandes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center cursor-pointer"
                onClick={() => setStockBehavior("default")}
              >
                {stockBehavior === "default" && <div className="w-3 h-3 rounded-full bg-[#7f1d1c]"></div>}
              </div>
              <Label htmlFor="default" className="cursor-pointer" onClick={() => setStockBehavior("default")}>
                Utiliser le comportement par défaut (Refuser les commandes)
              </Label>
            </div>
          </div>

          <div className="mt-3">
            <a href="#" className="text-[#7f1d1c] flex items-center gap-1 text-sm">
              <PenSquare size={20} />
              <span className="font-bold">Edit default behavior</span>
            </a>
          </div>
        </div>

        {/* Valeurs personnalisées */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-sm mb-2">Valeur personnalisée</p>
            <Input
              type="text"
              className="w-full"
              value={customValue1}
              onChange={(e) => setCustomValue1(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm mb-2">Valeur personnalisée</p>
            <Input
              type="text"
              className="w-full"
              value={customValue2}
              onChange={(e) => setCustomValue2(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm mb-2">Valeur personnalisée</p>
              <Input
                type="date"
                className="w-full"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
          </div>
        </div>
      </div>
    </div>
  )
}
