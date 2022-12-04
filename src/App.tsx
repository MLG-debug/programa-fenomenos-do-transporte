import { useState } from 'react'
import { Container, Box, Stack, Input, Text, ButtonGroup, Button, IconButton, Grid, GridItem, Divider, InputGroup, InputRightAddon, InputLeftAddon, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, Flex, NumberInput, NumberInputField, Image, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react"
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
    placeholder: "Desnível",
    popover: "Informe o desnível entre os reservatórios"
  },
  {
    letter: "D",
    unit: "mm",
    placeholder: "Diâmetro",
    popover: "Informe o diâmetro da tubulação"
  },
  {
    letter: "L",
    unit: "m",
    placeholder: "Comprimento",
    popover: "Informe o comprimento da tubulação"
  }
]

const materials = [
  { name: "Ferro fundido", value: 0.3 / 1000 },
  { name: "PVC", value: 0.01 / 1000 },
  { name: "Aço", value: 0.05 / 1000 },
]

export const App = () => {
  let initial_values = { hm: 0.0, energyCV: 0.0, energyW: 0.0, f: 0.0, hf: 0.0 }
  const [material, setMaterial] = useState(0)
  const [result, setResult] = useState(initial_values)
  const [calculate, setCalculate] = useState(false)
  const [efficiency, setEfficiency] = useState(70)

  const { register, handleSubmit, reset, getValues, setValue } = useForm()

  const handleMaterial = (e: any) => {
    setMaterial(e.target.value)
    if (calculate) {
      recalculateEquation()
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
    let flow_rate = Q / 1000;
    let diameter = D / 1000;
    let velocity = (flow_rate * 4) / (Math.PI * diameter ** 2);
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
    let N = (10000 * flow_rate * hm) / (efficiency / 100)
    setResult({ hm, hf, f, energyCV: N / 735, energyW: N });
    window.scrollTo(0, 10000)
  }

  const recalculateEquation = () => {
    let Q = parseFloat(getValues("Q"));
    let h = parseFloat(getValues("h"));
    let D = parseFloat(getValues("D"));
    let L = parseFloat(getValues("L"));
    let m = material;
    calculateEquation({ Q, h, D, L, m });
  }

  const handleReset = () => {
    setMaterial(0);
    setResult(initial_values);
    setCalculate(false);
    setEfficiency(70)
    reset({ Q: '', h: '', D: '', L: '' })
    console.log(getValues())
  }

  const handleEfficiency = (value: number) => {
    setEfficiency(value)
    recalculateEquation()
  }

  const Paint = (str: string) => {
    return (
      <Box as='span' bg="blue.300" color={"white"} px={2} py={0.5} borderRadius={6}>{str}</Box>
    )
  }

  return (
    <Container maxW='container.lg' my={10} >
      <Box bg="gray.50" mt={4} p={4} border="1px" borderColor={'gray.300'} borderRadius={8}>
        <Text fontSize="lg" alignItems="center" display="flex" color="gray.500" fontWeight="medium"> <GroupsIcon sx={{ mr: 1 }} /> Alunos - Fenômenos de Transporte - Engenharia de Computação - UEPG</Text>
        <Divider my={4} />
        <Flex width="100%" flexWrap="wrap">
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Michael L. Gomes`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Eduardo E. S. Borges`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Gabriel M. Oliveira`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Victor G. A. e Almeida`)}</Text>
          <Text m={1} whiteSpace="nowrap" fontSize="lg" color="gray.500" fontWeight="medium">{Paint(`Mateus J. S. Gomes`)}</Text>
        </Flex>
      </Box>
      <Box bg="gray.50" mt={4} p={4} border="1px" borderColor={'gray.300'} borderRadius={8} onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Text fontSize="lg" alignItems="center" display="flex" color="gray.500" fontWeight="medium"> <TerminalIcon sx={{ mr: 1 }} /> Software de dimensionamento preliminar de bombas para transporte de água</Text>
        </Box>
        <Divider my={4} />
        <Box>
          <Text mb={2} fontSize="lg" color="gray.500" fontWeight="medium">Representação</Text>
          <Box display="flex" justifyContent="center">
            <Image pointerEvents="none" src="/BOMBA.png" height="130px" objectFit='cover' alt="reservatórios conectados por uma bomba" />
          </Box>
          <Divider my={4} />
          <Text mb={2} fontSize="lg" color="gray.500" fontWeight="medium">Informações do problema</Text>
          <Grid templateColumns='0.8fr 0.8fr 0.8fr 0.8fr 0.5fr' gap={4} as="form" id="form_calculate">
            {inputs.map(input => (
              <GridItem key={input.placeholder} rowSpan={2} >
                <Popover trigger='hover'>
                  <PopoverTrigger>
                    <InputGroup>
                      <InputLeftAddon children={input.letter} color='gray.500' />
                      {/* <Input onFocus={(e) => e.target.select()} step="0.0001" type="number" placeholder={input.placeholder} {...register(input.letter, { required: true })} /> */}
                      <NumberInput min={0.001} precision={3} step={0.001} >
                        <NumberInputField {...register(input.letter, { required: true })} onFocus={(e) => e.target.select()} pr={1} textAlign="center" color="gray.600" fontWeight="medium" fontSize={14} pl={1} borderRadius={0} placeholder={input.placeholder} />
                      </NumberInput>
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
              <Button size="sm" key={m.name} colorScheme="blue" id={"material_" + i} value={i} onClick={handleMaterial} disabled={material == i} >{m.name} (ε = {m.value})</Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      {calculate ?
        <Box bg="gray.50" mt={4} p={4} border="1px" borderColor={'gray.300'} borderRadius={8}>
          <Text alignItems="center" display="flex" fontSize="lg" color="gray.500" fontWeight="medium"><BookIcon sx={{ mr: 1 }} />Resultados</Text>
          <Divider my={4} />
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Coeficiente de perda de carga (f) {Paint(`${result.f.toFixed(3)} m`)}</Text>
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Perda de carga (Hf) {Paint(`${result.hf.toFixed(3)} m`)}</Text>
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Altura manométrica da bomba (Hm) {Paint(`${result.hm.toFixed(3)} m`)}</Text>
          <Divider my={4} />
          <Text fontSize="lg" color="gray.500" fontWeight="medium">Rendimento (η)</Text>
          <Slider
            flex='1'
            focusThumbOnChange={false}
            value={efficiency}
            onChange={handleEfficiency}
          > <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize='xs' color="gray.500" fontWeight="medium" boxSize='fit-content' p={1} borderRadius={6} children={`${efficiency}%`} />
          </Slider>
          <Text mt={1} fontSize="lg" color="gray.500" fontWeight="medium">Potência elétrica consumida {Paint(`${result.energyW.toFixed(3)} W`)} = {Paint(`${result.energyCV.toFixed(3)} CV`)}</Text>
        </Box>
        : null}
    </Container>
  )
}
