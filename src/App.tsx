import { useState } from 'react'
import { Container, Box, Stack, Input } from "@chakra-ui/react"

/**
 *Você foi contratado para desenvolver um software de dimensionamento preliminar de bombas 
 para transporte de água (γ=10 kN/m³; ν=10-6 m²/s)) entre reservatórios de grandes dimensões 
 (Figura 1). O sentido do escoamento é de R1 para R2. Variáveis de entrada: vazão (Q) (L/s), 
 desnível entre reservatórios (h) (m), diâmetro da tubulação (D) (mm), comprimento 
 da tubulação (L) (m) e para as seguintes opções de material da tubulação
 (fornecer as seguintes opções para o usuário):
Ferro fundido – ε = 0,30 mm
PVC – ε = 0,010 mm
Aço – ε = 0,050 mm
Desenvolva um algoritmo que retorne a altura manométrica da bomba (Hm) (m) e a potência elétrica consumida pelo conjunto elevatório N (cv). Adote um rendimento de 70%.
 */

export const App = () => {
  return (
    <Container>
      <Box>

      </Box>
      <Box>
        <Stack spacing={3}>
          <Input variant='outline' placeholder='Outline' />
          <Input variant='filled' placeholder='Filled' />
          <Input variant='flushed' placeholder='Flushed' />
          <Input variant='unstyled' placeholder='Unstyled' />
        </Stack>
      </Box>
      <Box>

      </Box>
    </Container>
  )
}
