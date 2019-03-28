import React from 'react'
import { colors } from 'ui'
import { Flex, Text, Image, Box, AbsoluteLink, Card } from 'ui/common'

export default ({ name, src, link, author, description }) => (
  <Flex style={{ minHeight: '180px' }} flexDirection="row">
    <Flex
      flexDirection="column"
      flex={1}
      style={{ borderRadius: '10px', padding: '10px 20px' }}
      mr="30px"
      bg="white"
    >
      <Flex
        flexDirection="row"
        style={{ borderBottom: '1px solid #f2f4f9' }}
        py="20px"
        pl="10px"
      >
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Community:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {'Coinhatcher'}
        </Text>
      </Flex>
      <Flex
        flexDirection="row"
        style={{ borderBottom: '1px solid #f2f4f9' }}
        py="20px"
        pl="10px"
      >
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Organization:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {'Band Protocol'}
        </Text>
      </Flex>
      <Flex flexDirection="row" py="20px" pl="10px">
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Description:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {
            'Coinhatcher is a decentralized data curation with a mission to provide trusted and reliable information in blockchain industry. Ranging from daily news to founder’s directory and crypto economics.'
          }
        </Text>
      </Flex>
    </Flex>
    <Flex
      flexDirection="column"
      flex={1}
      style={{ borderRadius: '10px', padding: '10px 20px' }}
      bg="white"
    >
      <Flex
        flexDirection="row"
        style={{ borderBottom: '1px solid #f2f4f9' }}
        py="20px"
        pl="10px"
      >
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Website:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {'coinhatcher.com'}
        </Text>
      </Flex>
      <Flex
        flexDirection="row"
        style={{ borderBottom: '1px solid #f2f4f9' }}
        py="20px"
        pl="10px"
      >
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Contract:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {'0x4e9ce36e442e55ecd9025b9a6e0d88485d628a67'}
        </Text>
      </Flex>
      <Flex
        flexDirection="row"
        style={{ borderBottom: '1px solid #f2f4f9' }}
        py="20px"
        pl="10px"
      >
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Created:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {'20-03-2019  17:00'}
        </Text>
      </Flex>
      <Flex flexDirection="row" py="20px" pl="10px">
        <Flex mr="10px" style={{ minWidth: '90px' }} justifyContent="flex-end">
          <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
            Transferable:
          </Text>
        </Flex>
        <Text fontSize="13px" lineHeight={1.64}>
          {'Yes'}
        </Text>
      </Flex>
    </Flex>
  </Flex>
)
