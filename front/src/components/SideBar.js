import { useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import GroupIcon from '@material-ui/icons/Group';
import ComputerIcon from '@material-ui/icons/Computer';
import AddIcon from '@material-ui/icons/Add';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { FileService } from '../service/file.service';


const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	borderRadius: 5,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

export default function SideBar({
	sideBarOption,
	setSideBarOption,
	reRender,
	setReRender,
}) {
	// State Variables
	const [listActive1, setListActive1] = useState('list-item-active');
	const [listActive2, setListActive2] = useState('');
	const [open, setOpen] = useState(false);
	const [isFileUploaded, setIsFileUploaded] = useState(false);
	const [metaData, setMetaData] = useState({});
	const [file, setFile] = useState();
	const fileService = new FileService();

	// Functions
	// Button Styles
	const useStyles = makeStyles({
		btn: {
			color: '#5F6368',
		},
		uploadbtn: {
			color: '#2185FC',
			fontSize: '40px',
		},
	});

	const classes = useStyles();

	// Functions
	const handleOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);

	const handleClick = (option) => {
		setSideBarOption(option);
	};

	const uploadMetaData = () => {
		const data = {
			metadata: {
				filename: metaData.fileName,
				createdate: metaData.createDate,
				lastmodified: metaData.lastModified,
				filesize: metaData.fileSize.toString(),
				type: metaData.type,
			},
		};
		fetch(`${process.env.REACT_APP_IP}/setMetaData`, {
			method: 'POST',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					reRender ? setReRender(0) : setReRender(1);
					setFile();
					setMetaData({});
					setIsFileUploaded(false);
				}
			})
			.catch((err) => console.log(err));
	};

	const handleUpload = async (e) => {
		var data = new FormData();
		data.append('file', file);
		console.log(file)
		// data.append('filename', metaData?.fileName);
		const response = await fileService.uploadOneFile(data)
		console.log(response)
		if (response.status === 200) {
			console.log('ok')
			reRender ? setReRender(0) : setReRender(1);
					setFile();
					setMetaData({});
					setIsFileUploaded(false);
		} else {
			toast.error(`${response?.response?.data?.errorMessage}`);
		}


		/* fetch(`${process.env.REACT_APP_IP}/uploadFile`, {
			method: 'POST',
			withCredentials: true,
			credentials: 'include',
			body: data,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					uploadMetaData(metaData);
				}
			})
			.catch((err) => console.log(err));

		e.target.files = {};
		handleClose(); */
	};

	return (
		<div className="sidebar">
			<div className="upload-btn" onClick={handleOpen}>
				<img
					src={process.env.PUBLIC_URL + '/static/add.svg'}
					alt="Logo"
				/>
				New
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="upload-modal" sx={style}>
					{isFileUploaded ? (
						<div className="metaData">
							<p>File name : {metaData.fileName}</p>
							<p>Created : {metaData.createDate}</p>
							<p>Last modified : {metaData.lastModified}</p>
							<p>size : {metaData.fileSize} MB</p>
							{ }
						</div>
					) : (
						<div className="metaData not-uploaded">
							<p>No files yet</p>
						</div>
					)}

					{isFileUploaded ? (
						<Button
							className="upload-button"
							variant="contained"
							component="label"
							onClick={(e) => {
								handleUpload(e);
							}}
						>
							Upload
						</Button>
					) : (
						<Button variant="contained" component="label">
							Select File
							<input
								type="file"
								onChange={(e) => {
									setMetaData({
										fileName: e.target.files[0].name,
										createDate: new Date(
											e.target.files[0].lastModified
										).toDateString(),
										lastModified: new Date(
											e.target.files[0].lastModified
										).toDateString(),
										fileSize: (
											Math.round(
												e.target.files[0].size * Math.pow(10, -6) * 100
											) / 100
										).toFixed(3),
										type: e.target.files[0].type,
									});

									setFile(e.target.files[0]);
									setIsFileUploaded(true);
								}}
								hidden
							/>
						</Button>
					)}
				</Box>
			</Modal>
			<ul className="sidebar-list">
				<li
					className={`list-item ${listActive1}`}
					onClick={() => {
						handleClick(0);
						setListActive1('list-item-active');
						setListActive2('');
					}}
				>
					<ComputerIcon className={classes.btn} fontSize="large" />
					<p className="list-text">My Drive</p>
				</li>
			</ul>
		</div>
	);
};

