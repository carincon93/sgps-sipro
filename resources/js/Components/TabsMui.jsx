import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useState } from 'react'

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other} className="!w-full">
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    }
}

export default function TabsMui({ children, tabs = [] }) {
    const theme = useTheme()
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleChangeIndex = (index) => {
        setValue(index)
    }

    const filteredArray = children.filter((item) => item !== null)

    return (
        <>
            <AppBar position="static" color="transparent" sx={{ boxShadow: 'none' }}>
                <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="inherit" variant="fullWidth" aria-label="full width tabs">
                    {tabs.map((tab, i) => (
                        <Tab key={i} label={tab.label} {...a11yProps(i)} />
                    ))}
                </Tabs>
            </AppBar>
            <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex} className="w-full">
                {filteredArray.length > 0 ? (
                    filteredArray.map((child, i) => (
                        <TabPanel key={i} value={value} index={i} dir={theme.direction}>
                            {child?.props.children}
                        </TabPanel>
                    ))
                ) : (
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {children}
                    </TabPanel>
                )}
            </SwipeableViews>
        </>
    )
}
