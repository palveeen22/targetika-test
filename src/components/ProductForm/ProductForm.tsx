import { Controller, FieldError } from 'react-hook-form';
import { Input } from '../../components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { useProductForm } from './useProductForm';
import { characteristicOptions, typeOptions, CharacteristicName } from './productFormOptions';
import { ProductFormValues } from './productFormSchema';
import { ErrorMessage } from '../ErrorMessage';

type TProductFormProps = {
  onSubmit: (data: ProductFormValues) => void;
}

export const ProductForm = ({ onSubmit }: TProductFormProps) => {
  const { form, fields, append, remove } = useProductForm();
  const { register, control, handleSubmit, formState: { errors }, watch } = form;

  const watchCharacteristics = watch("characteristics");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div>
        <Input
          {...register("productName")}
          placeholder="Название товара"
        />
        <ErrorMessage error={errors.productName} />
      </div>

      <div>
        <Input
          {...register("productCode")}
          placeholder="Код товара"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            e.target.value = `A2-${value}`;
            form.setValue("productCode", value);
          }}
        />
        <ErrorMessage error={errors.productCode} />
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2">
          <Controller
            name={`characteristics.${index}.name`}
            control={control}
            render={({ field }) => (
              <>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  if (value !== 'custom') {
                    form.setValue(`characteristics.${index}.name`, value);
                  }
                }} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите характеристику" />
                  </SelectTrigger>
                  <SelectContent>
                    {characteristicOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Другое</SelectItem>
                  </SelectContent>
                </Select>
                {field.value === 'custom' && (
                  <Input
                    {...register(`characteristics.${index}.name`)}
                    placeholder="Введите свое значение"
                  />
                )}
              </>
            )}
          />
          <ErrorMessage error={errors.characteristics?.[index]?.name} />

          <Controller
            name={`characteristics.${index}.type`}
            control={control}
            render={({ field }) => (
              <>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  if (value !== 'custom') {
                    form.setValue(`characteristics.${index}.type`, value);
                  }
                }} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions[watchCharacteristics[index]?.name as CharacteristicName]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Другое</SelectItem>
                  </SelectContent>
                </Select>
                {field.value === 'custom' && (
                  <Input
                    {...register(`characteristics.${index}.type`)}
                    placeholder="Введите свое значение"
                  />
                )}
              </>
            )}
          />
          <ErrorMessage error={errors.characteristics?.[index]?.type as FieldError} />

          <Button type="button" onClick={() => remove(index)}>Удалить характеристику</Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() => append({ name: '', type: '' })}
      >
        Добавить характеристику
      </Button>

      {Array.isArray(errors.characteristics) ? (
        errors.characteristics.map((error, index) => (
          <ErrorMessage key={index} error={error as FieldError} />
        ))
      ) : (
        <ErrorMessage error={errors.characteristics as FieldError} />
      )}

      <Button type="submit">Отправить</Button>
    </form>
  );
};