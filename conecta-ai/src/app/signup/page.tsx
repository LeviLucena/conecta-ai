
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateCurrentUserSettings } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, MessageCircle, KeyRound, Mail, Smartphone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const detailsSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  ddi: z.string().regex(/^\+?[1-9]\d{0,2}$/, { message: 'Invalid DDI (e.g., +1)' }).optional().or(z.literal('')),
  ddd: z.string().regex(/^\d{2,3}$/, { message: 'Invalid DDD (e.g., 11)' }).optional().or(z.literal('')),
  phone: z.string().regex(/^\d{7,9}$/, { message: 'Invalid phone (7-9 digits).' }).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  const hasEmail = !!data.email;
  const hasFullPhone = !!(data.ddi && data.ddd && data.phone);
  const hasPartialPhone = !!(data.ddi || data.ddd || data.phone);

  if (!hasEmail && !hasFullPhone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide an email or a complete phone number (DDI, DDD, and Phone).",
      path: ["email"],
    });
  }

  if (hasPartialPhone && !hasFullPhone) {
     ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "If providing a phone number, DDI, DDD, and Phone are all required.",
      path: ["ddi"], // Point to the first part of the phone for simplicity
    });
  }
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

const OTP_SIMULATION = "123456"; // Simulated OTP for verification

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [formStep, setFormStep] = React.useState<'details' | 'otpVerification'>('details');
  const [submittedDetails, setSubmittedDetails] = React.useState<DetailsFormValues | null>(null);
  const [verificationTarget, setVerificationTarget] = React.useState<string>('');
  const [verificationMethodIcon, setVerificationMethodIcon] = React.useState<React.ElementType | null>(null);
  const [otpValue, setOtpValue] = React.useState<string>('');

  const [isSubmittingDetails, setIsSubmittingDetails] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);


  const detailsForm = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: '',
      email: '',
      ddi: '',
      ddd: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    // This effect handles the initial loading state of the SignupPage.
    // If a user is NOT registered and lands on /signup (likely redirected by AuthGuard),
    // we turn off the 'isCheckingAuth' loader to show the form.
    // AuthGuard is responsible for redirecting already registered users AWAY from /signup.
    if (typeof window !== 'undefined') {
      const hasRegistered = localStorage.getItem('hasRegisteredConnectify') === 'true';
      if (!hasRegistered) {
        setIsCheckingAuth(false);
      }
      // If 'hasRegistered' is true, AuthGuard should have already redirected.
      // If this page still renders for a registered user,
      // 'isCheckingAuth' remains true, showing the loader,
      // and AuthGuard should handle the redirect in the next render cycle.
    }
  }, []); // Run only once on mount to set initial state of the page loader.

  const handleDetailsSubmit = async (values: DetailsFormValues) => {
    setIsSubmittingDetails(true);
    setSubmittedDetails(values);
    let target = '';
    let icon = null;

    if (values.email) {
      target = values.email;
      icon = Mail;
    } else if (values.ddi && values.ddd && values.phone) {
      target = `${values.ddi} ${values.ddd} ${values.phone}`;
      icon = Smartphone;
    }

    setVerificationTarget(target);
    setVerificationMethodIcon(() => icon);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'OTP Enviado!',
      description: `Um código de verificação foi (simulado) enviado para ${target}.`,
    });
    setFormStep('otpVerification');
    setIsSubmittingDetails(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otpValue === OTP_SIMULATION) {
      if (submittedDetails) {
        updateCurrentUserSettings({
          name: submittedDetails.name,
          email: submittedDetails.email,
          ddi: submittedDetails.ddi,
          ddd: submittedDetails.ddd,
          phone: submittedDetails.phone,
        });
        localStorage.setItem('hasRegisteredConnectify', 'true');
        toast({
          title: 'Perfil Criado!',
          description: `Bem-vindo ao Conecta Aí, ${submittedDetails.name}!`,
        });
        router.push('/'); // Redirect to home AFTER successful registration and localStorage update.
      }
    } else {
      toast({
        title: 'OTP Inválido',
        description: 'O OTP inserido está incorreto. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
    setIsVerifyingOtp(false);
  };

  const handleResendOtp = async () => {
    setIsSubmittingDetails(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'OTP Reenviado!',
      description: `Um novo código de verificação foi (simulado) enviado para ${verificationTarget}.`,
    });
    setIsSubmittingDetails(false);
  }

  if (isCheckingAuth) {
    // This loader is shown if:
    // 1. SignupPage just mounted and localStorage hasn't been checked yet by its useEffect.
    // 2. A registered user somehow lands on /signup and AuthGuard hasn't redirected them yet.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <MessageCircle className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">
            {formStep === 'details' ? 'Bem-vindo ao Conecta Aí!' : 'Verifique Sua Conta'}
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            {formStep === 'details'
              ? "Vamos configurar sua conta. Por favor, preencha seus detalhes."
              : `Insira o código de 6 dígitos (simulado) enviado para ${verificationTarget}. (Dica: é ${OTP_SIMULATION})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {formStep === 'details' && (
            <Form {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-4">
                <FormField
                  control={detailsForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Seu Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Alex Silva" {...field} className="text-base h-11 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email (Opcional se telefone fornecido)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="alex@example.com" {...field} className="text-base h-11 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-sm text-muted-foreground text-center py-1">OU</p>
                <div className="space-y-1">
                   <p className="text-sm font-medium leading-none text-foreground">Número de Telefone (Opcional se email fornecido)</p>
                   <div className="grid grid-cols-5 gap-2 items-start">
                    <FormField
                      control={detailsForm.control}
                      name="ddi"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel className="text-xs text-muted-foreground">DDI</FormLabel>
                          <FormControl>
                            <Input placeholder="+55" {...field} className="text-base h-11 focus:border-primary" />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={detailsForm.control}
                      name="ddd"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                           <FormLabel className="text-xs text-muted-foreground">DDD</FormLabel>
                          <FormControl>
                            <Input placeholder="11" {...field} className="text-base h-11 focus:border-primary" />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={detailsForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel className="text-xs text-muted-foreground">Número</FormLabel>
                          <FormControl>
                            <Input placeholder="912345678" {...field} className="text-base h-11 focus:border-primary" />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {detailsForm.formState.errors.root?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {detailsForm.formState.errors.root.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmittingDetails}>
                  {isSubmittingDetails ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  {isSubmittingDetails ? 'Prosseguindo...' : 'Continuar'}
                </Button>
              </form>
            </Form>
          )}

          {formStep === 'otpVerification' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className={cn("text-sm font-medium leading-none text-foreground flex items-center")}>
                  {verificationMethodIcon && React.createElement(verificationMethodIcon, { className: "mr-2 h-5 w-5 text-muted-foreground" })}
                  Código de Verificação
                </label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Insira o OTP de 6 dígitos"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="text-base h-12 text-center tracking-[0.3em] focus:border-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isVerifyingOtp || otpValue.length !== 6}>
                {isVerifyingOtp ? <Loader2 className="animate-spin mr-2" /> : <KeyRound className="mr-2 h-5 w-5" />}
                {isVerifyingOtp ? 'Verificando...' : 'Verificar & Cadastrar'}
              </Button>
              <Button type="button" variant="link" onClick={handleResendOtp} className="w-full text-primary" disabled={isSubmittingDetails}>
                {isSubmittingDetails ? <Loader2 className="animate-spin mr-2" /> : null}
                Reenviar OTP
              </Button>
               <Button type="button" variant="outline" onClick={() => { setFormStep('details'); setOtpValue(''); }} className="w-full" disabled={isSubmittingDetails || isVerifyingOtp}>
                Voltar para Detalhes
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <footer className="mt-10 text-center text-sm text-muted-foreground">
        Conecta Aí &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
