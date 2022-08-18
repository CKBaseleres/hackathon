import React, { useState } from "react";
import {Nav} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Drawer, } from 'react-bootstrap-drawer';
import { useMsal } from "@azure/msal-react";
import { MailOutline, PeopleOutline, HomeOutlined } from '@mui/icons-material'

// import '../pages/style/Dashboard.css'
import './Sidebar.css'
import 'react-bootstrap-drawer/lib/style.css';
const Sidebar = props => {
    const [open, setOpen] = useState(false);
    const { instance } = useMsal();

	const handleToggle = () => setOpen(!open);

    const handleLogout = (logoutType) => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
        // if (logoutType === "popup") {
        //     instance.logoutPopup({
        //         postLogoutRedirectUri: "/",
        //         mainWindowRedirectUri: "/"
        //     });
        // } else if (logoutType === "redirect") {
        //     instance.logoutRedirect({
        //         postLogoutRedirectUri: "/",
        //     });
        // }
    }
	return (
		<Drawer { ...props }>
			<Drawer.Toggle onClick={ handleToggle } />

			<Collapse in={ open }>
				<Drawer.Overflow>
					<Drawer.ToC>
                        <div>
                            <Drawer.Header href="/">HOME</Drawer.Header>
                            <Drawer.Nav>
                                <Drawer.Item href="/inbox">INBOX</Drawer.Item>                     
                                <Drawer.Item href="/applicants">APPLICANTS</Drawer.Item>
                                <Drawer.Item href="/archive">ARCHIVED</Drawer.Item>
                                {/* <Drawer.Item href="/" onClick={() => handleLogout()}>Logout</Drawer.Item> */}
                            </Drawer.Nav>
                        </div>
					</Drawer.ToC>
				</Drawer.Overflow>
			</Collapse>
		</Drawer>
	);
}
//   const Sidebar = withRouter(Side);
  export default Sidebar