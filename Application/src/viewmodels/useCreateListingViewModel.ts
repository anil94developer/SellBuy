import { useState, useCallback } from 'react';
import { useAppDispatch } from '../store';
import { createCarListing } from '../store/slices/carSlice';
import { setActiveTab, setFeedbackMessage } from '../store/slices/uiSlice';
import { CreateCarInput } from '../models/car.model';

export function useCreateListingViewModel() {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<CreateCarInput>({
    title: '',
    brand: 'Hyundai',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof CreateCarInput>(key: K, value: CreateCarInput[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (formError) setFormError(null);
    },
    [formError]
  );

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!form.title.trim()) {
      setFormError('Please enter a vehicle title (e.g. Honda City ZX)');
      return false;
    }
    if (!form.price || form.price <= 0) {
      setFormError('Please enter a valid asking price');
      return false;
    }
    if (!form.location.trim()) {
      setFormError('Please specify the city/location');
      return false;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      await dispatch(createCarListing(form)).unwrap();

      dispatch(setFeedbackMessage(`Success! "${form.title}" listed for sale.`));
      // Switch back to buyer tab so user can see their newly listed car in the list
      dispatch(setActiveTab('buyer'));

      // Reset form
      setForm({
        title: '',
        brand: 'Hyundai',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: '',
      });

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish listing';
      setFormError(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, form]);

  return {
    form,
    submitting,
    formError,
    updateField,
    handleSubmit,
  };
}
