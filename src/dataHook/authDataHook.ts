import { useMutation } from '@tanstack/react-query';
import { authService, LoginParams, RegisterParams } from '../services/authService';
import { useAuth } from '../app/context/AuthContext';

export const useLoginMutation = () => {
  const { setAuthUser } = useAuth();
  
  return useMutation({
    mutationFn: (params: LoginParams) => authService.login(params),
    onSuccess: (user) => {
      setAuthUser(user);
    }
  });
};

export const useRegisterMutation = () => {
  const { setAuthUser } = useAuth();
  
  return useMutation({
    mutationFn: (params: RegisterParams) => authService.register(params),
    onSuccess: (user) => {
      setAuthUser(user);
    }
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
  });
};

export const useConfirmResetMutation = () => {
  return useMutation({
    mutationFn: ({ password, confirmPassword, token }: { password: string, confirmPassword: string, token: string }) => 
      authService.confirmResetPassword(password, confirmPassword, token),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword, confirmPassword }: { oldPassword: string, newPassword: string, confirmPassword: string }) => 
      authService.changePassword(oldPassword, newPassword, confirmPassword),
  });
};
