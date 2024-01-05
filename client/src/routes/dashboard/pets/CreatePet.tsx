import axios from 'axios';
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { format } from "date-fns"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../components/ui/popover"
import { Calendar } from "../../../components/ui/calendar"
import { Input } from '../../../components/ui/input';
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { CalendarIcon } from "lucide-react";

// CreatePet

const CreatePet = () => {

    // Defining the form schema using Zod for validation. 

    const generateFormSchema = z.object({
        name: z.string().min(1),
        comments: z.string().min(3).max(160),
        petType: z.enum(["dog", "cat"]),
        dob: z.date(),
    });

    // Inferring the type for form values from the Zod schema.

    type GenerateFormValues = z.infer<typeof generateFormSchema>;

    // Initializing the form with react-hook-form and Zod for validation.

    const form = useForm<GenerateFormValues>({
        resolver: zodResolver(generateFormSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            comments: '',
            petType: 'dog',
            dob: new Date(),
        },
    });

    // onSubmit

    const onSubmit = async (data: GenerateFormValues) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            return;
        }

        // Preparing the data to be sent in the request.

        const petData = {
            ...data,
            ownerId: userId,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/pets', petData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            // Checking the response status and logging appropriate messages.

            if (response.status === 201) {
            } else {
                console.error('Failed to add pet', response.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error submitting form:', error.response?.data || error.message);
            } else {
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <div className='wrapper'>
            <div className="md:max-w-3xl lg:max-w-5xl mx-auto mt-32">
                <h1 className="font-bold mb-12 text-4xl sm:text-5xl">Add a New Pet</h1>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pet&apos;s magic name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="More-in-depth comments about the pet." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 text-center text-gray-500 text-sm my-2 mb-6">
                            <button
                                type="button"
                                className={`border p-2 rounded-2xl transition ${form.watch('petType') === 'dog' ? 'bg-neutral-700 text-white' : 'hover:bg-gray-100'}`}
                                onClick={() => form.setValue('petType', 'dog')}>
                                Dog
                            </button>
                            <button
                                type="button"
                                className={`border p-2 rounded-2xl transition ${form.watch('petType') === 'cat' ? 'bg-neutral-700 text-white' : 'hover:bg-gray-100'}`}
                                onClick={() => form.setValue('petType', 'cat')}>
                                Cat
                            </button>
                        </div>
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"}>
                                                {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" onSelect={field.onChange} />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center mt-10 mb-6">
                            <Button type="submit">Register a New Pet</Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default CreatePet;
