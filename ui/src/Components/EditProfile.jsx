import React from 'react';
import { Button, Col, Form, FormGroup, Label, Input} from 'reactstrap';
import { Loading } from './auth/Loading';

//URLs for PUT CALL
// const ApiUrl = "http://localhost:3001/dev/editProfile";
const ApiUrl = "https://bixe448nsa.execute-api.us-west-1.amazonaws.com/dev/editProfile";

//URLS for GET CALL
const GetApiUrl = `https://bixe448nsa.execute-api.us-west-1.amazonaws.com/dev/viewProfile?id=`;
// const GetApiUrl = "http://localhost:3001/dev/viewProfile?id="

// URLS for Files 
const toolPicUrl = 'https://cleaner-tool-pics.s3-us-west-1.amazonaws.com/'

// COPIES FOR REACT CLIENT 
const readyForVerificationCopy = "Submit";
const uploadCopy = "Save";

class CreateProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            profile: null,
            props: props,
            firstName: '',
            lastName: '',
            email: '',
            number: '',
            profile_id: '',
            ref1Name: '',
            ref1Email: '',
            ref2Name: '',
            ref2Email: '',
            govIdFlag: false,
            govId: null,
            toolPicFlag: false,
            toolPic: null,
            readyForVerification:0,
        };

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNumChange = this.handleNumChange.bind(this);
        this.handleRef1NameChange = this.handleRef1NameChange.bind(this);
        this.handleRef1EmailChange = this.handleRef1EmailChange.bind(this);
        this.handleRef2NameChange = this.handleRef2NameChange.bind(this);
        this.handleRef2EmailChange = this.handleRef2EmailChange.bind(this);
        this.handleLicenseUpload = this.handleLicenseUpload.bind(this);
        this.handleToolUpload = this.handleToolUpload.bind(this);
        this.handleAppStatusUpdate = this.handleAppStatusUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    // Get information to populate the profile before editing
    async componentDidMount()
    {
      const url = GetApiUrl+this.state.props.match.params.id;
      const resp = await fetch(url);
      const data = await resp.json();
      this.setState({profile: data, loading: false});

      // assign all required form variable from now
      this.state.firstName = this.state.profile.result.first_name;
      this.state.lastName = this.state.profile.result.last_name;
      this.state.number = this.state.profile.result.contact_num;
    }

    // functions to handle method update
    handleFirstNameChange(event) {
        this.setState({firstName: event.target.value});
    }

    handleAppStatusUpdate(event){
        if(event.target.name == "true"){
            this.setState({readyForVerification: 1});
        } else {
            this.setState({readyForVerification: 0});
        }
    }

    handleLastNameChange(event) {
            this.setState({lastName: event.target.value});
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handleNumChange(event) {
        this.setState({number: event.target.value});
    }

    handleRef1NameChange(event) {
        this.setState({ref1Name: event.target.value});
    }

    handleRef1EmailChange(event) {
        this.setState({ref1Email: event.target.value});
    }

    handleRef2NameChange(event) {
        this.setState({ref2Name: event.target.value});
    }

    handleRef2EmailChange(event) {
        this.setState({ref2Email: event.target.value});
    }

    handleLicenseUpload(event) {
        this.setState({
            govIdFlag: true,
            govId: event.target.files[0]
        });
    }
    
    handleToolUpload(event) {
        this.setState({
            toolPicFlag: true,
            toolPic: event.target.files[0]
        });
    }

    // check required form variables to make sure they are the original or new values
    checkIfBlank(){
        if(this.state.firstName == ""){
            this.state.firstName = this.state.profile.result.first_name;
        }  
        if(this.state.lastName  == ""){
            this.state.lastName = this.state.profile.result.last_name;
        }    
        if(this.state.number  == ""){
            this.state.number = this.state.profile.result.contact_num;         
        }     
        if(this.state.number  == ""){
            this.state.email = this.state.profile.result.email; 
        }  
    };

    handleSubmit(event) {
        this.checkIfBlank();
        event.preventDefault();
        fetch(ApiUrl,
            {
              method: "PUT",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
                },
              body: JSON.stringify( { 
                firstName:this.state.firstName, 
                lastName:this.state.lastName,
                email:this.state.email, 
                number:this.state.number, 
                reference1Name:this.state.ref1Name,
                reference1Email:this.state.ref1Email,
                reference2Name:this.state.ref2Name,
                reference2Email:this.state.ref2Email,
                govId:this.state.govIdFlag,
                toolPic:this.state.toolPicFlag,
                id:this.state.props.match.params.id, //added profile ID to payload
                readyForVerification: this.state.readyForVerification,
                }),
            })
            .then(res => res.json())
            .then(res => {
                if (res.govIdUrl!=='') { //upload gov id
                    fetch(res.govIdUrl, {
                        method: "PUT",
                        body: this.state.govId,
                        headers: {
                            "Content-Type": "application/pdf",
                            "x-amx-acl" : "public-read",
                        },
                    })
                }
                if (res.toolPicUrl!=='') { //upload tool file
                    fetch(res.toolPicUrl, {
                        method: "PUT",
                        body: this.state.toolPic,
                        headers: {
                            "Content-Type": "application/pdf",
                            "x-amx-acl" : "public-read",
                        },
                    })
                }
            window.location.href = ('/profiles/' + res.result) //redirect to Profile View Page
            })
            .catch(error => console.error('Error:', error));
    };
    
    render() {
        const checkToolFile = ()=>{
            if(this.state.profile.result.has_tools){
                // Currently displays "Took Pic File Uploaded" above the field, which seems incorrect. Until clarification, commenting out.
                return <a target="_blank" href={toolPicUrl + this.state.props.match.params.id + '.pdf'}>Tool Picture Link</a>
            } 
        }
        if (this.state.loading) {
            return <Loading />
            } else {
                return (
                    <>
                    {!this.state.profile ? (
                        <div> Profile Does Not Exist </div>
                    ) : (
                        <Form onSubmit={ this.handleSubmit }>
                        <div className="row-buffer side-buffer">
                        <FormGroup className="left-align" row>
                        <Label for="name" sm={2}><h4>Edit Profile</h4></Label>
                        </FormGroup>
                        <FormGroup className="left-align" row>
                            <Label for="name" sm={2}>First Name</Label>
                            <Col sm={10}>
                            <Input type="text" name="name" id="firstname" placeholder={this.state.profile.result.first_name} onChange={this.handleFirstNameChange} value={this.state.firstName}/>
                            </Col>
                        </FormGroup>
                        <FormGroup className="left-align" row>
                            <Label for="name" sm={2}>Last Name</Label>
                            <Col sm={10}>
                            <Input type="text" name="name" id="lastname" placeholder={this.state.profile.result.last_name} onChange={this.handleLastNameChange} value={this.state.lastName}/>
                            </Col>
                        </FormGroup>
                        <FormGroup className="left-align" row>
                            <Label for="email" sm={2}>Email</Label>
                            <Col sm={10}>
                            <Input type="email" name="email" id="email" placeholder={this.state.profile.result.email}  onChange={this.handleEmailChange} value={this.state.email}/>
                            </Col>
                        </FormGroup>
                        <FormGroup className="left-align" row>
                            <Label for="phone" sm={2}>Phone Number</Label>
                            <Col sm={10}>
                            <Input type="tel" name="phone" id="phone" placeholder={this.state.profile.result.contact_num} onChange={this.handleNumChange} value={this.state.number}/>
                            </Col>
                        </FormGroup>
                        <FormGroup className="left-align" row>
                            <Label for="govId" sm={2}>Government Issued ID</Label>
                            <Col sm={10}>
                            <Input type="file" name="govId" id="govId" onChange={this.handleLicenseUpload}/>
                            </Col>
                        </FormGroup>
                        {/** NOT CURRENTLY RETURNED IN GET CALL - FUTURE SPRINT WORK */}
                        <FormGroup className="left-align" row>
                            <Label sm={2}>Reference 1:</Label>
                            <Label for="referenceName" sm={1}>Name</Label>
                            <Col sm={4}>
                            <Input type="text" name="referenceName" id="referenceName" onChange={this.handleRef1NameChange} value={this.state.ref1Name}/>
                            </Col>
                            <Label for="referenceEmail" sm={1}>Email</Label>
                            <Col sm={4}>
                            <Input type="email" name="referenceEmail" id="referenceEmail" onChange={this.handleRef1EmailChange} value={this.state.ref1Email}/>
                            </Col>
                        </FormGroup>
                        <FormGroup className="left-align" row>
                            <Label sm={2}>Reference 2:</Label>
                            <Label for="referenceName" sm={1}>Name</Label>
                            <Col sm={4}>
                            <Input type="text" name="referenceName" id="referenceName" onChange={this.handleRef2NameChange} value={this.state.ref2Name}/>
                            </Col>
                            <Label for="referenceEmail" sm={1}>Email</Label>
                            <Col sm={4}>
                            <Input type="email" name="referenceEmail" id="referenceEmail" onChange={this.handleRef2EmailChange} value={this.state.ref2Email}/>
                            </Col>
                        </FormGroup>
                        {checkToolFile()}
                        <FormGroup className="left-align" row>
                            <Label for="tools" sm={2} >Tools/Supplies</Label>
                            <Col sm={10}>
                            <Input type="file" name="tools" id="tools" onChange={this.handleToolUpload} />
                            </Col>
                        </FormGroup>
                        <FormGroup className="right-align" check row>
                            <Button type="submit" name="false" onClick={this.handleAppStatusUpdate } style={{margin: '5px'}}>{uploadCopy}</Button> 
                            <Button type="submit" name="true" onClick={this.handleAppStatusUpdate} style={{backgroundColor: '#4CAF50'}}>{readyForVerificationCopy}</Button>
                        </FormGroup>
                        </div>
                    </Form>
                    )}
                    </>
                );
            }
    }
}

export default CreateProfile;
