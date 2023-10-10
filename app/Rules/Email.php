<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Email implements ValidationRule
{
    private $aprendiz;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($aprendiz)
    {
        $this->aprendiz = $aprendiz;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($this->aprendiz == 2 && preg_match("/(.*)sena\.edu\.co$/i", $value) == false && preg_match("/(.*)soy.sena\.edu\.co$/i", $value) == false && preg_match("/(.*)misena\.edu\.co$/i", $value) == false) {
            $fail("Debe ser un correo @sena.edu.co, @soy.sena.edu.co o @misena.edu.co");
        }
    }
}
