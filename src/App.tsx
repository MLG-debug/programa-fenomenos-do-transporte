import { useState } from 'react'
import { Container, Box, Stack, Input, Text, ButtonGroup, Button, IconButton, Grid, GridItem, Divider, InputGroup, InputRightAddon, InputLeftAddon, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, Flex } from "@chakra-ui/react"
import CalculateIcon from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form"
import TerminalIcon from '@mui/icons-material/Terminal';
import GroupsIcon from '@mui/icons-material/Groups';
import BookIcon from '@mui/icons-material/Book';
/*
 Você foi contratado para desenvolver um software de dimensionamento preliminar de bombas 
 para transporte de água (γ=10 kN/m³; ν=10-6 m²/s)) entre reservatórios de grandes dimensões 
 (Figura 1). O sentido do escoamento é de R1 para R2. 
 Variáveis de entrada: 
 
  * vazão (Q) (L/s), 
  * desnível entre reservatórios (h) (m), 
  * diâmetro da tubulação (D) (mm), 
  * comprimento da tubulação (L) (m) 
  
 e para as seguintes opções de material da tubulação 
 (fornecer as seguintes opções para o usuário):

  * Ferro fundido – ε = 0,30 mm
  * PVC – ε = 0,010 mm
  * Aço – ε = 0,050 mm

  Desenvolva um algoritmo que 
  * retorne a altura manométrica da bomba (Hm) (m) e a potência elétrica consumida
  pelo conjunto elevatório N (cv). 
  * Adote um rendimento de 70%.
*/

const inputs = [
  {
    letter: "Q",
    unit: "L/s",
    placeholder: "Vazão",
    popover: "Informe a vazão do fluído"
  },
  {
    letter: "h",
    unit: "m",
    placeholder: "Desnível reservatórios",
    popover: "Informe o desnível entre os reservatórios"
  },
  {
    letter: "D",
    unit: "mm",
    placeholder: "Diâmetro tubulação",
    popover: "Informe o diâmetro da tubulação"
  },
  {
    letter: "L",
    unit: "m",
    placeholder: "Comprimento tubulação",
    popover: "Informe o comprimento da tubulação"
  }
]

const materials = [
  { name: "Ferro fundido", value: 0.3 / 1000 },
  { name: "PVC", value: 0.01 / 1000 },
  { name: "Aço", value: 0.05 / 1000 }
]

export const App = () => {
  let initial_values = { hm: 0.0, energyCV: 0.0, energyW: 0.0, f: 0.0, hf: 0.0 }
  const [material, setMaterial] = useState(0)
  const [result, setResult] = useState(initial_values)
  const [calculate, setCalculate] = useState(false)

  const { register, handleSubmit, reset, getValues } = useForm()

  const handleMaterial = (e: any) => {
    setMaterial(e.target.value)
    if (calculate) {
      let Q = parseFloat(getValues("Q"));
      let h = parseFloat(getValues("h"));
      let D = parseFloat(getValues("D"));
      let L = parseFloat(getValues("L"));
      let m = e.target.value;
      calculateEquation({ Q, h, D, L, m });
    }
  }

  const onSubmit = (data: any) => {
    let Q = parseFloat(data.Q);
    let h = parseFloat(data.h);
    let D = parseFloat(data.D);
    let L = parseFloat(data.L);
    let m = material;
    calculateEquation({ Q, h, D, L, m });
    setCalculate(true);
  }

  const calculateEquation = ({ Q, h, D, L, m }: { Q: number, h: number, D: number, L: number, m: number, }) => {
    let diameter = D / 1000;
    let velocity = (Q * 4) / (Math.PI * diameter ** 2);
    let viscosity = 10 ** -6;
    // número do Reinaldo
    let Re = (velocity * diameter) / viscosity;
    // calcular f
    let eq1 = (64 / Re) ** 8;
    let eq3 = Math.log((materials[m].value / (3.7 * diameter)) + (5.74 / (Re ** 0.9)))
    let eq4 = (2500 / Re) ** 6;
    let eq2 = (eq3 - eq4) ** -16;
    let f = (eq1 + 9.5 * eq2) ** 0.125
    // calcular hf
    let hf = f * ((L / diameter) * (velocity ** 2) / (2 * 9.81))
    let hm = h + hf;
    // calcular potência
    let N = (10000 * Q * hm) / 0.7
    setResult({ hm, hf, f, energyCV: N / 735, energyW: N });
  }

  const handleReset = () => {
    reset()
    setMaterial(0);
    setResult(initial_values);
    setCalculate(false);
  }

  const Paint = (str: string) => {
    return (
      <Box as='span' bg="blue.300" color={"white"} px={2} py={0.5} borderRadius={6}>{str}</Box>
    )
  }

  return (
    <Container maxW='container.lg' mt={10} >

      <Box shadow={"md"} p={4} border="1px" borderColor={'gray.300'} borderRadius={8} onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Text fontSize="lg" alignItems="center" display="flex" color="gray.500" fontWeight="medium"> <TerminalIcon sx={{ mr: 1 }} /> Software de dimensionamento preliminar de bombas para transporte de água</Text>
        </Box>
        <Divider my={4} />
        <Box>
          <Text mb={2} fontSize="lg" color="gray.500" fontWeight="medium">Informações do problema</Text>
          <Grid templateColumns='0.8fr 0.8fr 0.8fr 0.8fr 0.5fr' gap={4} as="form" id="form_calculate">
            {inputs.map(input => (
              <GridItem key={input.placeholder} rowSpan={2} >
                <Popover trigger='hover'>
                  <PopoverTrigger>
                    <InputGroup>
                      <InputLeftAddon children={input.letter} color='gray.500' />
                      <Input step="0.0001" type="number" placeholder={input.placeholder} {...register(input.letter, { required: true })} />
                      <InputRightAddon children={input.unit} color='gray.500' />
                    </InputGroup>
                  </PopoverTrigger>
                  <PopoverContent width="fit-content">
                    <PopoverArrow />
                    <PopoverBody color="gray.500">{input.popover}</PopoverBody>
                  </PopoverContent>
                </Popover>
              </GridItem>
            ))}
            <GridItem>
              <ButtonGroup isAttached >
                <Button form="form_calculate" type='submit' width="100%" colorScheme="blue" leftIcon={<CalculateIcon />}>  Calcular </Button>
                {calculate && <Button onClick={handleReset} colorScheme="red" ><CloseIcon /></Button>}
              </ButtonGroup>
            </GridItem>
          </Grid>
        </Box>
        <Divider my={4} />
        <Box>
          <Text mb={2} fontSize="lg" color="gray.500" fontWeight="medium">Opções de material da tubulação</Text>
          <ButtonGroup variant='solid' >
            {materials.map((m, i) => (
              <Button key={m.name} colorScheme="blue" id={"material_" + i} value={i} onClick={handleMaterial} disabled={material == i} >{m.name} (ε = {m.value})</Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      {calculate ?
        <Box shadow={"md"} mt={4} p={4} border="1px" borderColor={'gray.300'} borderRadius={8}>
          <Text alignItems="center" display="flex" fontSize="lg" color="gray.500" fontWeight="medium"><BookIcon sx={{ mr: 1 }} />Resultados</Text>
          <Divider my={4} />
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Carga (f): {Paint(`${result.f.toFixed(4)} m`)}</Text>
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Perda de carga (Hf): {Paint(`${result.hf.toFixed(4)} m`)}</Text>
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Altura manométrica da bomba (Hm): {Paint(`${result.hm.toFixed(4)} m`)}</Text>
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Potência elétrica consumida: {Paint(`${result.energyW.toFixed(4)} W`)} = {Paint(`${result.energyCV.toFixed(4)} CV`)}</Text>
        </Box>
        : null}
      <Box shadow={"md"} mt={4} p={4} border="1px" borderColor={'gray.300'} borderRadius={8}>
        <Text fontSize="lg" alignItems="center" display="flex" color="gray.500" fontWeight="medium"> <GroupsIcon sx={{ mr: 1 }} /> Alunos</Text>
        <Divider my={4} />
        <Flex width="100%" flexWrap="wrap">
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Michael Lemes Gomes`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Eduardo Espirito Santo Borges`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Gabriel Manesco de Oliveira`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Victor Gabriel de Almeida e Almeida`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Matheus José da Silva Gomes`)}</Text>
        </Flex>
      </Box>
    </Container>
  )
}
