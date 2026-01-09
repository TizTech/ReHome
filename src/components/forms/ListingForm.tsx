import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Listing, Provider, RoomType, ContactMethod } from '../../types'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { X } from 'lucide-react'

const PROVIDERS: Provider[] = ['Unite Students', 'iQ', 'Vita', 'Other']
const ROOM_TYPES: RoomType[] = ['Ensuite', 'Studio', 'Shared', 'Other']
const CONTACT_METHODS: ContactMethod[] = ['email', 'phone', 'instagram']

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  provider: z.enum(['Unite Students', 'iQ', 'Vita', 'Other']),
  buildingName: z.string().min(1, 'Building name is required'),
  university: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postcode: z.string().optional(),
  roomType: z.enum(['Ensuite', 'Studio', 'Shared', 'Other']),
  pricePerWeek: z.number().min(1, 'Price must be greater than 0'),
  billsIncluded: z.boolean(),
  contractStart: z.string().min(1, 'Contract start date is required'),
  contractEnd: z.string().min(1, 'Contract end date is required'),
  availableFrom: z.string().min(1, 'Available from date is required'),
  minTenancyWeeks: z.number().optional(),
  deposit: z.number().optional(),
  cashbackAmount: z.number().optional(),
  discountedWeeks: z.number().optional(),
  incentiveNotes: z.string().optional(),
  amenities: z.array(z.string()),
  images: z.array(z.string().url().or(z.literal(''))).optional(),
  description: z.string().min(1, 'Description is required'),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactInstagram: z.string().optional(),
  preferredMethod: z.enum(['email', 'phone', 'instagram']),
}).refine(
  (data) => {
    const contractStart = new Date(data.contractStart)
    const contractEnd = new Date(data.contractEnd)
    return contractStart <= contractEnd
  },
  { message: 'Contract start must be before or equal to contract end', path: ['contractEnd'] }
).refine(
  (data) => {
    const availableFrom = new Date(data.availableFrom)
    const contractEnd = new Date(data.contractEnd)
    return availableFrom <= contractEnd
  },
  { message: 'Available from must be before or equal to contract end', path: ['availableFrom'] }
).refine(
  (data) => {
    if (data.preferredMethod === 'email') return !!data.contactEmail
    if (data.preferredMethod === 'phone') return !!data.contactPhone
    if (data.preferredMethod === 'instagram') return !!data.contactInstagram
    return true
  },
  { message: 'At least one contact method is required for the preferred method', path: ['contactEmail'] }
)

type FormData = z.infer<typeof formSchema>

interface ListingFormProps {
  initialData?: Listing
  onSubmit: (listing: Listing) => void
  onCancel?: () => void
}

export function ListingForm({ initialData, onSubmit, onCancel }: ListingFormProps) {
  const [newAmenity, setNewAmenity] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || ['']
  )
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          provider: initialData.provider,
          buildingName: initialData.buildingName,
          university: initialData.university || '',
          city: initialData.city,
          postcode: initialData.postcode || '',
          roomType: initialData.roomType,
          pricePerWeek: initialData.pricePerWeek,
          billsIncluded: initialData.billsIncluded,
          contractStart: initialData.contractStart.split('T')[0],
          contractEnd: initialData.contractEnd.split('T')[0],
          availableFrom: initialData.availableFrom.split('T')[0],
          minTenancyWeeks: initialData.minTenancyWeeks,
          deposit: initialData.deposit,
          cashbackAmount: initialData.incentives.cashbackAmount,
          discountedWeeks: initialData.incentives.discountedWeeks,
          incentiveNotes: initialData.incentives.notes || '',
          amenities: initialData.amenities,
          images: initialData.images,
          description: initialData.description,
          contactName: initialData.contact.name || '',
          contactEmail: initialData.contact.email || '',
          contactPhone: initialData.contact.phone || '',
          contactInstagram: initialData.contact.instagram || '',
          preferredMethod: initialData.contact.preferredMethod,
        }
      : {
          amenities: [],
          images: [''],
          preferredMethod: 'email',
        },
  })
  
  const amenities = watch('amenities') || []
  const preferredMethod = watch('preferredMethod')
  
  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setValue('amenities', [...amenities, newAmenity.trim()])
      setNewAmenity('')
    }
  }
  
  const removeAmenity = (amenity: string) => {
    setValue(
      'amenities',
      amenities.filter((a) => a !== amenity)
    )
  }
  
  const addImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }
  
  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
    setValue('images', newUrls.filter(url => url.trim() !== ''))
  }
  
  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newUrls.length > 0 ? newUrls : [''])
    setValue('images', newUrls.filter(url => url.trim() !== ''))
  }
  
  const onSubmitForm = (data: FormData) => {
    const now = new Date().toISOString()
    const listing: Listing = {
      id: initialData?.id || crypto.randomUUID(),
      title: data.title,
      provider: data.provider,
      buildingName: data.buildingName,
      university: data.university || undefined,
      city: data.city,
      postcode: data.postcode || undefined,
      roomType: data.roomType,
      pricePerWeek: data.pricePerWeek,
      billsIncluded: data.billsIncluded,
      contractStart: new Date(data.contractStart).toISOString(),
      contractEnd: new Date(data.contractEnd).toISOString(),
      availableFrom: new Date(data.availableFrom).toISOString(),
      minTenancyWeeks: data.minTenancyWeeks || undefined,
      deposit: data.deposit || undefined,
      incentives: {
        cashbackAmount: data.cashbackAmount || undefined,
        discountedWeeks: data.discountedWeeks || undefined,
        notes: data.incentiveNotes || undefined,
      },
      amenities: data.amenities,
      images: (data.images || []).filter(url => url.trim() !== ''),
      description: data.description,
      contact: {
        name: data.contactName || undefined,
        email: data.contactEmail || undefined,
        phone: data.contactPhone || undefined,
        instagram: data.contactInstagram || undefined,
        preferredMethod: data.preferredMethod,
      },
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
      status: initialData?.status || 'available',
    }
    
    onSubmit(listing)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
      {/* Basics Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Basics</h2>
        <div className="space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g., Unite Students Brook Hall — Ensuite takeover"
          />
          
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Provider
            </label>
            <select
              {...register('provider')}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Building Name"
            {...register('buildingName')}
            error={errors.buildingName?.message}
          />
          
          <Input
            label="University (optional)"
            {...register('university')}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="Postcode (optional)"
              {...register('postcode')}
            />
          </div>
        </div>
      </section>
      
      {/* Room & Pricing Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Room & Pricing</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Room Type
            </label>
            <select
              {...register('roomType')}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              {ROOM_TYPES.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Price per Week (£)"
            type="number"
            {...register('pricePerWeek', { valueAsNumber: true })}
            error={errors.pricePerWeek?.message}
          />
          
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('billsIncluded')}
                className="w-4 h-4 rounded border-border text-accent focus:ring-focus-ring"
              />
              <span className="text-sm text-text">Bills included</span>
            </label>
          </div>
          
          <Input
            label="Deposit (£, optional)"
            type="number"
            {...register('deposit', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
          />
        </div>
      </section>
      
      {/* Dates Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Dates</h2>
        <div className="space-y-4">
          <Input
            label="Contract Start"
            type="date"
            {...register('contractStart')}
            error={errors.contractStart?.message}
          />
          <Input
            label="Contract End"
            type="date"
            {...register('contractEnd')}
            error={errors.contractEnd?.message}
          />
          <Input
            label="Available From"
            type="date"
            {...register('availableFrom')}
            error={errors.availableFrom?.message}
          />
          <Input
            label="Minimum Tenancy Weeks (optional)"
            type="number"
            {...register('minTenancyWeeks', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
          />
        </div>
      </section>
      
      {/* Amenities Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Amenities</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {amenities.map((amenity) => (
              <Badge key={amenity} className="cursor-pointer" onClick={() => removeAmenity(amenity)}>
                {amenity} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add amenity (e.g., gym, cinema room)"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addAmenity()
                }
              }}
              className="flex-1"
            />
            <Button type="button" onClick={addAmenity}>
              Add
            </Button>
          </div>
        </div>
      </section>
      
      {/* Incentives Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Incentives (optional)</h2>
        <div className="space-y-4">
          <Input
            label="Cashback Amount (£)"
            type="number"
            {...register('cashbackAmount', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
          />
          <Input
            label="Discounted Weeks"
            type="number"
            {...register('discountedWeeks', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
          />
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Incentive Notes
            </label>
            <textarea
              {...register('incentiveNotes')}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="Additional details about incentives"
            />
          </div>
        </div>
      </section>
      
      {/* Media Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Images (optional)</h2>
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                placeholder="Image URL"
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeImageUrl(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addImageUrl}>
            Add Image URL
          </Button>
        </div>
      </section>
      
      {/* Description Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Description</h2>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Description
          </label>
          <textarea
            {...register('description')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent transition-all duration-200 ${
              errors.description ? 'border-red-500 focus:ring-red-500' : 'border-border'
            }`}
            rows={6}
            placeholder="Describe the accommodation, location, and any other relevant details..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
      </section>
      
      {/* Contact Section */}
      <section>
        <h2 className="text-xl font-semibold text-text mb-4">Contact</h2>
        <div className="space-y-4">
          <Input
            label="Name (optional)"
            {...register('contactName')}
          />
          
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Preferred Contact Method
            </label>
            <select
              {...register('preferredMethod')}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              {CONTACT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Email"
            type="email"
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
            required={preferredMethod === 'email'}
          />
          
          <Input
            label="Phone"
            type="tel"
            {...register('contactPhone')}
            error={errors.contactPhone?.message}
            required={preferredMethod === 'phone'}
          />
          
          <Input
            label="Instagram"
            {...register('contactInstagram')}
            error={errors.contactInstagram?.message}
            required={preferredMethod === 'instagram'}
            placeholder="@username"
          />
        </div>
      </section>
      
      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <Button type="submit" variant="primary" size="lg" className="flex-1">
          {initialData ? 'Update Listing' : 'Create Listing'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

